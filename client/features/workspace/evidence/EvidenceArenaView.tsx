"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Flag, Play, Settings2, ShieldCheck, Trophy, Users } from "lucide-react";
import type { ArenaLeaderboardEntry, ArenaScenario, ArenaScenarioTemplateInput, ArenaSession } from "@shared/types/evidence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EvidenceArenaViewProps {
  scenarios: ArenaScenario[];
  sessions: ArenaSession[];
  leaderboard: ArenaLeaderboardEntry[];
  activeArena: ArenaSession | null;
  syncing: boolean;
  onCreateTemplate: (input: ArenaScenarioTemplateInput) => Promise<ArenaScenario>;
  onStart: (scenarioId: string, privacyMode: "full" | "redacted", teamLobby?: boolean) => Promise<boolean>;
  onBegin: () => Promise<boolean>;
  onJoin: (lobbyCode: string) => Promise<boolean>;
  onMatchmake: (scenarioId: string, privacyMode: "full" | "redacted") => Promise<boolean>;
  onRecordNote: (summary: string) => Promise<void>;
  onSubmit: () => Promise<unknown>;
  onVerifyReport: (sessionId: string) => Promise<boolean>;
}

function remaining(deadlineAt?: string) {
  if (!deadlineAt) return "Not started";
  const milliseconds = Math.max(0, Date.parse(deadlineAt) - Date.now());
  const minutes = Math.floor(milliseconds / 60_000);
  const seconds = Math.floor(milliseconds % 60_000 / 1000);
  return minutes + ":" + String(seconds).padStart(2, "0");
}

export function EvidenceArenaView({
  scenarios,
  sessions,
  leaderboard,
  activeArena,
  syncing,
  onCreateTemplate,
  onStart,
  onBegin,
  onJoin,
  onMatchmake,
  onRecordNote,
  onSubmit,
  onVerifyReport,
}: EvidenceArenaViewProps) {
  const [selected, setSelected] = useState(scenarios[0]?.id || "");
  const [privacyMode, setPrivacyMode] = useState<"full" | "redacted">("full");
  const [mode, setMode] = useState<"solo" | "team">("solo");
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [template, setTemplate] = useState({ organizationId: "", title: "", briefing: "", fileName: "incident.js", source: "", acceptanceCode: "const assert = require('node:assert/strict');\nconst candidate = require('../incident.js');\nassert.equal(candidate.recovered(), true);" });
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!selected && scenarios[0]) setSelected(scenarios[0].id);
  }, [scenarios, selected]);

  useEffect(() => {
    if (!activeArena) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [activeArena]);

  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selected) || scenarios[0],
    [scenarios, selected]
  );
  const completed = sessions.filter((session) => session.status === "graded");

  if (activeArena) {
    const scenario = scenarios.find((item) => item.id === activeArena.scenarioId);
    if (activeArena.status === "lobby") {
      return (
        <div className="space-y-3 p-3">
          <section className="rounded-lg border border-violet-400/25 bg-violet-400/[0.05] p-4 text-center">
            <Users className="mx-auto h-6 w-6 text-violet-300" />
            <div className="mt-2 text-[8px] font-bold uppercase tracking-[0.18em] text-violet-300">Team incident lobby</div>
            <h3 className="mt-1 text-xs font-semibold">{scenario?.title || activeArena.scenarioId}</h3>
            <div className="mx-auto mt-3 w-fit rounded border border-violet-300/25 bg-[#080d16] px-4 py-2 font-mono text-lg font-bold tracking-[0.25em] text-violet-200">
              {activeArena.lobbyCode || activeArena.id.slice(-6).toUpperCase()}
            </div>
            <p className="mt-2 text-[8px] text-slate-500">Share this code with teammates. The assessment timer starts only when the lobby begins.</p>
            <div className="mt-3 rounded border border-slate-800 bg-[#080d16] p-2 text-left">
              <div className="text-[8px] uppercase tracking-wider text-slate-600">Participants ({activeArena.participants.length})</div>
              {activeArena.participants.map((participant) => (
                <div key={participant.id} className="mt-1 text-[9px] text-slate-300">{participant.name} · {participant.role}</div>
              ))}
            </div>
            <Button
              disabled={syncing}
              onClick={() => void onBegin()}
              className="mt-3 h-8 w-full bg-violet-300 text-[9px] font-bold uppercase tracking-wider text-violet-950 hover:bg-violet-200"
            >
              <Play className="mr-1.5 h-3.5 w-3.5" />Begin timed incident
            </Button>
          </section>
        </div>
      );
    }
    return (
      <div className="space-y-3 p-3">
        <section className="rounded-lg border border-rose-400/25 bg-rose-400/[0.05] p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-rose-300">Live incident</div>
              <h3 className="mt-1 text-xs font-semibold">{scenario?.title || activeArena.scenarioId}</h3>
            </div>
            <Badge className="border-rose-400/30 bg-rose-400/10 text-[8px] text-rose-200">
              <Clock3 className="mr-1 h-3 w-3" />{remaining(activeArena.deadlineAt)}
            </Badge>
          </div>
          <p className="mt-2 text-[9px] leading-relaxed text-slate-400">{scenario?.briefing}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[8px] uppercase tracking-wider">
            <div className="rounded border border-slate-800 bg-[#080d16] p-2">
              <div className="text-slate-600">AI policy</div>
              <div className="mt-1 text-slate-300">{scenario?.allowedAI || "recorded"}</div>
            </div>
            <div className="rounded border border-slate-800 bg-[#080d16] p-2">
              <div className="text-slate-600">Evidence actions</div>
              <div className="mt-1 text-slate-300">{activeArena.actions.length}</div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Diagnosis / decision log</h4>
          <Textarea
            aria-label="Arena diagnosis note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Record a falsifiable diagnosis, containment action, or recovery decision..."
            className="mt-2 min-h-20 border-slate-700 bg-[#080d16] text-[10px]"
          />
          <Button
            variant="outline"
            disabled={!note.trim() || syncing}
            onClick={async () => {
              await onRecordNote(note);
              setNote("");
            }}
            className="mt-2 h-8 w-full border-slate-700 bg-transparent text-[9px] uppercase tracking-wider"
          >
            <Flag className="mr-1.5 h-3.5 w-3.5" />Record evidence
          </Button>
        </section>

        <section className="rounded-lg border border-amber-400/15 bg-amber-400/[0.04] p-3">
          <div className="text-[9px] leading-relaxed text-amber-100/80">
            Submission grades the complete event history against scenario-specific correctness, diagnosis, security,
            testing, communication, architecture, and recovery rubrics.
          </div>
          <Button
            disabled={syncing}
            onClick={() => void onSubmit()}
            className="mt-3 h-8 w-full bg-amber-300 text-[9px] font-bold uppercase tracking-wider text-amber-950 hover:bg-amber-200"
          >
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Submit signed report
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      <section className="rounded-lg border border-rose-400/15 bg-rose-400/[0.04] p-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-rose-300" />
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-200">Practice an engineering scenario</h3>
            <p className="mt-0.5 text-[9px] text-slate-500">Timed incidents, hidden faults, teams, rubrics, signed reports</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-3">
        <div className="text-[9px] font-bold uppercase tracking-wider text-cyan-300">Join a team lobby</div>
        <div className="mt-2 flex gap-2">
          <Input
            aria-label="Arena lobby code"
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12))}
            placeholder="LOBBY CODE"
            className="h-8 border-slate-700 bg-[#080d16] font-mono text-[9px] uppercase tracking-wider"
          />
          <Button
            variant="outline"
            disabled={syncing || !consent || joinCode.length < 4}
            onClick={async () => {
              if (await onJoin(joinCode)) setJoinCode("");
            }}
            className="h-8 border-cyan-400/25 bg-cyan-400/10 px-3 text-[8px] uppercase text-cyan-200"
          >
            Join
          </Button>
        </div>
        <label className="mt-2 flex items-start gap-2 text-[8px] leading-relaxed text-slate-500">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 rounded border-slate-700 bg-slate-900" />
          I consent to evidence recording for this shared assessment.
        </label>
      </section>

      <section className="rounded-lg border border-violet-400/15 bg-violet-400/[0.04] p-3">
        <button
          type="button"
          onClick={() => setCreatorOpen((value) => !value)}
          className="flex w-full items-center justify-between text-left"
        >
          <span>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-violet-300">Create a practice scenario</span>
            <span className="mt-0.5 block text-[8px] text-slate-500">Organization-specific fault, policy, timer, workspace, and rubric template</span>
          </span>
          <Settings2 className="h-4 w-4 text-violet-300" />
        </button>
        {creatorOpen && (
          <div className="mt-3 space-y-2 border-t border-violet-400/10 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                aria-label="Template organization"
                value={template.organizationId}
                onChange={(event) => setTemplate((value) => ({ ...value, organizationId: event.target.value }))}
                placeholder="Organization ID"
                className="h-8 border-slate-700 bg-[#080d16] text-[9px]"
              />
              <Input
                aria-label="Template title"
                value={template.title}
                onChange={(event) => setTemplate((value) => ({ ...value, title: event.target.value }))}
                placeholder="Scenario title"
                className="h-8 border-slate-700 bg-[#080d16] text-[9px]"
              />
            </div>
            <Textarea
              aria-label="Template briefing"
              value={template.briefing}
              onChange={(event) => setTemplate((value) => ({ ...value, briefing: event.target.value }))}
              placeholder="Incident briefing and evaluator expectations"
              className="min-h-16 border-slate-700 bg-[#080d16] text-[9px]"
            />
            <Input
              aria-label="Template starter filename"
              value={template.fileName}
              onChange={(event) => setTemplate((value) => ({ ...value, fileName: event.target.value }))}
              placeholder="incident.js"
              className="h-8 border-slate-700 bg-[#080d16] font-mono text-[9px]"
            />
            <Textarea
              aria-label="Template starter source"
              value={template.source}
              onChange={(event) => setTemplate((value) => ({ ...value, source: event.target.value }))}
              placeholder="Paste the locked starter source and injected fault..."
              className="min-h-24 border-slate-700 bg-[#080d16] font-mono text-[9px]"
            />
            <div>
              <div className="mb-1 text-[8px] font-bold uppercase tracking-wider text-violet-300">Hidden acceptance test</div>
              <Textarea
                aria-label="Template hidden acceptance test"
                value={template.acceptanceCode}
                onChange={(event) => setTemplate((value) => ({ ...value, acceptanceCode: event.target.value }))}
                placeholder="Executable Node.js assertions. This source stays hidden from participants."
                className="min-h-28 border-violet-400/20 bg-[#080d16] font-mono text-[9px]"
              />
            </div>
            <Button
              variant="outline"
              disabled={syncing || !template.organizationId.trim() || !template.title.trim() || !template.briefing.trim() || !template.fileName.trim() || !template.source.trim() || !template.acceptanceCode.trim()}
              onClick={async () => {
                const fileName = template.fileName.trim();
                const created = await onCreateTemplate({
                  organizationId: template.organizationId.trim(),
                  title: template.title.trim(),
                  briefing: template.briefing.trim(),
                  kind: "outage",
                  difficulty: "advanced",
                  timeLimitMinutes: 45,
                  allowedAI: "limited",
                  starterFiles: { "INCIDENT.md": template.briefing.trim(), [fileName]: template.source },
                  injectedFaults: [{ id: "org-hidden-fault", description: "Organization-defined hidden fault", hidden: true, files: { [fileName]: template.source } }],
                  acceptanceTests: [{ id: "org-hidden-acceptance", code: template.acceptanceCode.trim(), timeoutMs: 10_000 }],
                });
                setSelected(created.id);
                setCreatorOpen(false);
              }}
              className="h-8 w-full border-violet-400/25 bg-violet-400/10 text-[8px] uppercase tracking-wider text-violet-200"
            >
              Save evaluator template
            </Button>
          </div>
        )}
      </section>

      <section className="space-y-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => setSelected(scenario.id)}
            className={cn(
              "w-full rounded-lg border p-3 text-left transition",
              selected === scenario.id
                ? "border-rose-400/30 bg-rose-400/[0.06]"
                : "border-slate-800 bg-[#0b121e] hover:border-slate-700"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold text-slate-200">{scenario.title}</span>
              <Badge className="border-slate-700 bg-slate-900 text-[7px] uppercase text-slate-500">{scenario.difficulty}</Badge>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[8px] leading-relaxed text-slate-500">{scenario.briefing}</p>
            <div className="mt-2 flex gap-3 text-[8px] text-slate-600">
              <span><Clock3 className="mr-1 inline h-3 w-3" />{scenario.timeLimitMinutes} min</span>
              <span><Users className="mr-1 inline h-3 w-3" />AI: {scenario.allowedAI}</span>
            </div>
          </button>
        ))}
      </section>

      {selectedScenario && (
        <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Assessment controls</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["solo", "team"] as const).map((assessmentMode) => (
              <button
                key={assessmentMode}
                type="button"
                onClick={() => setMode(assessmentMode)}
                className={cn(
                  "rounded border px-2 py-1.5 text-[8px] uppercase",
                  mode === assessmentMode ? "border-violet-400/30 bg-violet-400/10 text-violet-200" : "border-slate-800 text-slate-500"
                )}
              >
                {assessmentMode === "team" ? "Team lobby" : "Solo run"}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {(["full", "redacted"] as const).map((reportMode) => (
              <button
                key={reportMode}
                type="button"
                onClick={() => setPrivacyMode(reportMode)}
                className={cn(
                  "flex-1 rounded border px-2 py-1.5 text-[8px] uppercase",
                  privacyMode === reportMode ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200" : "border-slate-800 text-slate-500"
                )}
              >
                {reportMode} report
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-start gap-2 text-[8px] leading-relaxed text-slate-500">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900"
            />
            I consent to timed code, AI-use, debugging, communication, and runtime evidence recording.
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              disabled={!consent || syncing}
              onClick={() => void onStart(selectedScenario.id, privacyMode, mode === "team")}
              className="h-8 bg-rose-400 px-2 text-[8px] font-bold uppercase tracking-wider text-rose-950 hover:bg-rose-300"
            >
              <Play className="mr-1 h-3.5 w-3.5" />{mode === "team" ? "Create lobby" : "Start solo"}
            </Button>
            <Button
              variant="outline"
              disabled={!consent || syncing}
              onClick={() => void onMatchmake(selectedScenario.id, privacyMode)}
              className="h-8 border-violet-400/25 bg-violet-400/10 px-2 text-[8px] font-bold uppercase tracking-wider text-violet-200"
            >
              <Users className="mr-1 h-3.5 w-3.5" />Quick match
            </Button>
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.04] p-3">
          <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Signed assessment reports</div>
          {completed.slice(-3).reverse().map((session) => (
            <div key={session.id} className="mt-2 rounded border border-slate-800 bg-[#080d16] p-2">
              <div className="flex items-center justify-between text-[9px]">
                <span className="truncate">{scenarios.find((item) => item.id === session.scenarioId)?.title}</span>
                <span className="font-bold text-emerald-300">{session.weightedScore || 0}</span>
              </div>
              <div className="mt-1 text-[7px] text-slate-500">
                Hidden acceptance {session.acceptance?.passed || 0}/{session.acceptance?.total || 0} · {session.acceptance?.calibration?.repeatedTrials || 0} repeated trials · weighted correctness {session.acceptance?.score || 0}% · {session.signedReport?.signatureIssuer || "unverified issuer"}
              </div>
              <div className="mt-1 truncate font-mono text-[7px] text-slate-600">{session.signedReport?.digest}</div>
              <button
                type="button"
                onClick={() => void onVerifyReport(session.id)}
                className="mt-1 text-[7px] font-bold uppercase tracking-wider text-emerald-300 hover:text-emerald-200"
              >
                Verify signed report
              </button>
            </div>
          ))}
        </section>
      )}

      {leaderboard.length > 0 && (
        <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Leaderboard</div>
          {leaderboard.slice(0, 5).map((entry) => (
            <div key={entry.sessionId} className="mt-2 flex items-center gap-2 text-[9px]">
              <span className="w-5 font-bold text-amber-300">#{entry.rank}</span>
              <span className="min-w-0 flex-1 truncate text-slate-400">{entry.participant}</span>
              <span className="font-semibold text-slate-200">{entry.score}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
