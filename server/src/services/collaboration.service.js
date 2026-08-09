const { supabase } = require("../config/db");
const { decodeWorkspace } = require("./project.service");
const { verifyInviteToken, verifyReconnectToken } = require("../collaboration/tokens");

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const missingSchemaCodes = new Set(["42P01", "PGRST204", "PGRST205"]);
let warnedMissingSchema = false;

function collaborationSchemaUnavailable(error) {
  return missingSchemaCodes.has(error?.code) || /collaboration_(rooms|members).*schema cache|relation .* does not exist/i.test(
    `${error?.message || ""} ${error?.details || ""}`
  );
}

function warnMissingSchema(error) {
  if (warnedMissingSchema) return;
  warnedMissingSchema = true;
  console.warn(
    "Collaboration database tables are unavailable; Redis remains authoritative until server/schema.sql is applied:",
    error?.message || error
  );
}

function normalizeGuest(user = {}) {
  return {
    username: typeof user.username === "string" ? user.username.trim().slice(0, 80) : "Guest",
    userId: typeof user.userId === "string" ? user.userId.slice(0, 160) : "",
    avatar: typeof user.avatar === "string" ? user.avatar : undefined,
    status: typeof user.status === "string" ? user.status.slice(0, 160) : "Editing",
  };
}

function isPublicDemoRoom(roomId) {
  return roomId === "demo-sandbox" || roomId.startsWith("demo-sandbox:") ||
    (process.env.NODE_ENV !== "production" && !UUID_PATTERN.test(roomId));
}

async function loadProject(roomId) {
  if (!supabase || !UUID_PATTERN.test(roomId)) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,language,owner_id,code,created_at,updated_at")
    .eq("id", roomId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getMembership(roomId, userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("collaboration_members")
    .select("role,active")
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (collaborationSchemaUnavailable(error)) {
      warnMissingSchema(error);
      return null;
    }
    throw error;
  }
  return data?.active === false ? null : data;
}

async function upsertMembership(roomId, userId, role) {
  if (!supabase) return;
  const { error } = await supabase.from("collaboration_members").upsert(
    [{ room_id: roomId, user_id: userId, role, active: true, updated_at: new Date().toISOString() }],
    { onConflict: "room_id,user_id" }
  );
  if (error) {
    if (collaborationSchemaUnavailable(error)) {
      warnMissingSchema(error);
      return;
    }
    throw error;
  }
}

async function authorizeRoomJoin({ roomId, authUser, suppliedUser, inviteToken, reconnectToken }) {
  if (isPublicDemoRoom(roomId)) {
    const guest = normalizeGuest(suppliedUser);
    const role = suppliedUser?.isOrganizer ? "organizer" : "editor";
    return { ...guest, role, isOrganizer: role === "organizer", project: null, recovered: false };
  }

  if (!authUser?._id || !authUser?.username) {
    throw new Error("Sign in before joining a private collaboration room.");
  }

  const project = await loadProject(roomId);
  if (!project) throw new Error("This collaboration room does not exist or is unavailable.");

  const userId = String(authUser._id);
  const isOrganizer = project.owner_id === userId;
  const recoveredClaims = verifyReconnectToken(reconnectToken, roomId, userId);
  let role = isOrganizer ? "organizer" : recoveredClaims?.role;

  if (!role) {
    const membership = await getMembership(roomId, userId);
    role = membership?.role;
  }

  if (!role) {
    const invite = verifyInviteToken(inviteToken, roomId);
    if (!invite) throw new Error("A valid organizer invite is required for this workspace.");
    role = invite.role === "viewer" ? "viewer" : "editor";
    await upsertMembership(roomId, userId, role);
  }

  return {
    username: authUser.username,
    userId,
    avatar: authUser.avatar,
    status: "Editing",
    role,
    isOrganizer,
    project,
    recovered: Boolean(recoveredClaims),
  };
}

async function getAuthorizedProject({ roomId, authUser, inviteToken, reconnectToken }) {
  const identity = await authorizeRoomJoin({
    roomId,
    authUser,
    suppliedUser: null,
    inviteToken,
    reconnectToken,
  });
  const project = identity.project;
  if (!project) return null;
  const workspace = decodeWorkspace(project.code);

  return {
    project: {
      _id: project.id,
      title: project.title,
      language: project.language,
      owner: project.owner_id,
      isDemo: false,
      code: workspace ? workspace.files[workspace.activeFile] || "" : project.code || "",
      files: workspace?.files,
      activeFile: workspace?.activeFile,
      createdAt: project.created_at,
      updatedAt: project.updated_at || project.created_at,
      storage: "cloud",
      collaborationRole: identity.role,
    },
  };
}

async function loadRoomSnapshot(roomId) {
  if (!supabase || !UUID_PATTERN.test(roomId)) return null;
  const { data, error } = await supabase
    .from("collaboration_rooms")
    .select("room_id,files,active_file,collaborators_can_edit,organizer_user_id,organizer_username,crdt_state,revision,updated_at")
    .eq("room_id", roomId)
    .maybeSingle();

  if (error) {
    if (collaborationSchemaUnavailable(error)) {
      warnMissingSchema(error);
      return null;
    }
    throw error;
  }

  if (!data) return null;
  return {
    roomId: data.room_id,
    files: data.files || {},
    activeFile: data.active_file || "",
    collaboratorsCanEdit: data.collaborators_can_edit !== false,
    organizer: data.organizer_user_id ? {
      userId: data.organizer_user_id,
      username: data.organizer_username || "",
      socketId: "",
    } : null,
    crdtState: data.crdt_state || "",
    revision: Number(data.revision || 0),
    updatedAt: data.updated_at,
  };
}

async function persistRoomSnapshot(room) {
  if (!supabase || !UUID_PATTERN.test(room.roomId)) return false;
  const { error } = await supabase.from("collaboration_rooms").upsert(
    [{
      room_id: room.roomId,
      project_id: room.roomId,
      files: room.files || {},
      active_file: room.activeFile || "",
      collaborators_can_edit: room.collaboratorsCanEdit !== false,
      organizer_user_id: room.organizer?.userId || null,
      organizer_username: room.organizer?.username || "",
      crdt_state: room.crdtState || "",
      revision: Number(room.revision || 0),
      updated_at: new Date().toISOString(),
    }],
    { onConflict: "room_id" }
  );

  if (error) {
    if (collaborationSchemaUnavailable(error)) {
      warnMissingSchema(error);
      return false;
    }
    throw error;
  }
  return true;
}

function initialRoomFromProject(project, initialFiles = {}, activeFile = "") {
  const workspace = decodeWorkspace(project?.code) || null;
  const files = workspace?.files || initialFiles || {};
  return {
    files,
    activeFile: workspace?.activeFile || activeFile || Object.keys(files)[0] || "",
    collaboratorsCanEdit: true,
    organizer: project?.owner_id ? { userId: project.owner_id, username: "", socketId: "" } : null,
    crdtState: "",
    revision: 0,
  };
}

module.exports = {
  authorizeRoomJoin,
  getAuthorizedProject,
  initialRoomFromProject,
  isPublicDemoRoom,
  loadRoomSnapshot,
  persistRoomSnapshot,
  upsertMembership,
};
