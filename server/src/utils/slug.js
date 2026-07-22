function slugifyProjectId(value, maximumLength = 64) {
  const input = String(value || "workspace").trim().toLowerCase();
  let slug = "";
  let pendingDash = false;
  let hasAlphaNumeric = false;

  for (const character of input) {
    const code = character.charCodeAt(0);
    const alphaNumeric = (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
    const preserved = character === "_" || character === "-";

    if (alphaNumeric) {
      if (pendingDash && slug && slug.length < maximumLength) slug += "-";
      pendingDash = false;
      hasAlphaNumeric = true;
      if (slug.length < maximumLength) slug += character;
    } else if (preserved) {
      if (slug && slug.length < maximumLength) slug += character;
    } else if (slug) {
      pendingDash = true;
    }

    if (slug.length >= maximumLength) break;
  }

  while (slug.startsWith("-")) slug = slug.slice(1);
  while (slug.endsWith("-")) slug = slug.slice(0, -1);
  return hasAlphaNumeric && slug ? slug : `workspace-${Date.now()}`;
}

module.exports = { slugifyProjectId };
