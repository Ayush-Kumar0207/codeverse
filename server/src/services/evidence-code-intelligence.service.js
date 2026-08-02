const { Project, ScriptTarget, ModuleKind, SyntaxKind } = require("ts-morph");
const path = require("path");

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
function cleanFiles(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([name, content]) => typeof name === "string" && typeof content === "string"));
}
function structuralFileKind(name, content) {
  const extension = path.extname(name).toLowerCase();
  if ([".html", ".css", ".scss", ".svg"].includes(extension)) return "frontend";
  if (extension === ".sql") return /\b(?:create|alter|drop|update|insert|delete)\b/i.test(content) ? "migration" : "data";
  if ([".yaml", ".yml"].includes(extension)) return /\bkind\s*:\s*(?:Deployment|StatefulSet|Service)\b/i.test(content) ? "deployment" : "config";
  if (extension === ".json") return "config";
  return "module";
}
function createProject(files) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      allowJs: true,
      checkJs: true,
      noEmit: true,
      target: ScriptTarget.ES2022,
      module: ModuleKind.CommonJS,
      skipLibCheck: true,
    },
  });
  for (const [name, content] of Object.entries(files)) {
    if (/\.[cm]?[jt]sx?$/.test(name)) project.createSourceFile("/workspace/" + name.replace(/\\/g, "/"), content, { overwrite: true });
  }
  return project;
}
function sourceName(sourceFile) {
  return sourceFile.getFilePath().replace(/^\/workspace\//, "");
}
function resolveImport(source, request, names) {
  if (!request.startsWith(".")) return null;
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(source), request));
  return names.find((name) => name === base || name.replace(/\.[^.]+$/, "") === base || name.startsWith(base + "/index.")) || null;
}
function analyzeWorkspace(filesValue, events = []) {
  const files = cleanFiles(filesValue);
  const names = Object.keys(files);
  const project = createProject(files);
  const nodes = names.map((fileName) => ({ id: "file:" + fileName, kind: structuralFileKind(fileName, files[fileName]), label: fileName, fileName }));
  const edges = [], edgeIds = new Set(), nodeIds = new Set(nodes.map((node) => node.id));
  const imports = new Map(names.map((name) => [name, new Set()]));
  const symbols = new Map(names.map((name) => [name, { declarations: [], calls: [], parameters: [], returns: 0 }]));
  const addNode = (node) => {
    if (!nodeIds.has(node.id)) {
      nodeIds.add(node.id);
      nodes.push(node);
    }
    return node.id;
  };
  const addEdge = (source, target, relation, evidence = "compiler") => {
    if (!source || !target || source === target) return;
    const id = [source, relation, target, evidence].join(":");
    if (!edgeIds.has(id)) {
      edgeIds.add(id);
      edges.push({ id, source, target, relation, evidence });
    }
  };
  for (const sourceFile of project.getSourceFiles()) {
    const name = sourceName(sourceFile);
    const sourceId = "file:" + name;
    const requests = [];
    const observed = { test: false, api: false, data: false, queue: false, frontend: false };
    for (const declaration of sourceFile.getImportDeclarations()) requests.push(declaration.getModuleSpecifierValue());
    for (const declaration of sourceFile.getExportDeclarations()) {
      if (declaration.getModuleSpecifierValue()) requests.push(declaration.getModuleSpecifierValue());
    }
    for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const expression = call.getExpression().getText();
      const firstArgument = call.getArguments()[0]?.getText().replace(/^["']|["']$/g, "");
      if (/^(?:describe|it|test)(?:\.|$)|(?:^|\.)expect$|(?:^|\.)assert(?:\.|$)/.test(expression)) observed.test = true;
      if (/(?:^|\.)(?:get|post|put|patch|delete|use)$/.test(expression) && /(?:router|route|app)/i.test(expression)) observed.api = true;
      if (/(?:^|\.)(?:query|from|table|insert|update|upsert|delete)$/.test(expression)) observed.data = true;
      if (/\b(?:publish|emit|sendToQueue|consume|subscribe)$/.test(expression)) observed.queue = true;
      if (expression === "require" && firstArgument) requests.push(firstArgument);
      if (/^(fetch|axios\.(get|post|put|patch|delete))$/.test(expression) && firstArgument) {
        addEdge(sourceId, addNode({ id: "api:" + firstArgument, kind: "api", label: firstArgument }), "calls");
      }
      if (/\.(from|table)$/.test(expression) && firstArgument) {
        addEdge(sourceId, addNode({ id: "data:" + firstArgument, kind: "data", label: firstArgument }), "reads");
      }
      if (/\.(insert|update|upsert|delete)$/.test(expression)) {
        const target = call.getFirstAncestorByKind(SyntaxKind.CallExpression)?.getArguments()[0]?.getText().replace(/^["']|["']$/g, "");
        if (target) addEdge(sourceId, addNode({ id: "data:" + target, kind: "data", label: target }), "writes");
      }
      if (/\b(publish|emit|sendToQueue)$/.test(expression) && firstArgument) {
        addEdge(sourceId, addNode({ id: "queue:" + firstArgument, kind: "queue", label: firstArgument }), "publishes");
      }
      symbols.get(name).calls.push(expression);
    }
    for (const request of requests) {
      const target = resolveImport(name, request, names);
      if (target) {
        imports.get(name).add(target);
        addEdge(sourceId, "file:" + target, "imports");
      } else if (!request.startsWith(".") && !request.startsWith("node:")) {
        addEdge(sourceId, addNode({ id: "provider:" + request, kind: "provider", label: request }), "calls");
      }
    }
    for (const declaration of [
      ...sourceFile.getFunctions(),
      ...sourceFile.getClasses(),
      ...sourceFile.getVariableDeclarations(),
    ]) {
      const nameText = declaration.getName?.();
      if (nameText) symbols.get(name).declarations.push(nameText);
      for (const parameter of declaration.getParameters?.() || []) symbols.get(name).parameters.push(parameter.getName());
    }
    symbols.get(name).returns = sourceFile.getDescendantsOfKind(SyntaxKind.ReturnStatement).length;
    observed.frontend = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 || sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0;
    const fileNode = nodes.find((node) => node.id === sourceId);
    if (fileNode) {
      if (observed.test) fileNode.kind = "test";
      else if (observed.api) fileNode.kind = "api";
      else if (observed.queue) fileNode.kind = "queue";
      else if (observed.data) fileNode.kind = "data";
      else if (observed.frontend) fileNode.kind = "frontend";
      else if (edges.some((edge) => edge.source === sourceId && ["calls", "reads", "writes", "publishes"].includes(edge.relation))) fileNode.kind = "service";
    }
  }
  for (const [fileName, content] of Object.entries(files)) {
    const source = "file:" + fileName;
    if (/\.html?$/.test(fileName)) {
      for (const match of content.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
        const request = match[1].split(/[?#]/)[0].replace(/^\.\//, "");
        const target = names.find((name) => name === request || name.endsWith("/" + request));
        if (target) addEdge(source, "file:" + target, "renders", "html-parser");
      }
    }
    if (/\.sql$/i.test(fileName)) {
      for (const match of content.matchAll(/\b(?:from|join|into|update|table)\s+["']?([a-z_][\w.]*)/gi)) {
        const write = /into|update/i.test(match[0]);
        addEdge(source, addNode({ id: "data:" + match[1], kind: "data", label: match[1] }), write ? "writes" : "reads", "sql-parser");
      }
    }
  }
  const coverage = new Map();
  let runtimeCorrelations = 0;
  for (const event of events) {
    const payload = event.payload || {};
    const fileName = event.fileName || payload.fileName;
    const source = fileName && nodeIds.has("file:" + fileName) ? "file:" + fileName : null;
    if (payload.coverage && typeof payload.coverage === "object") {
      for (const [coveredFile, value] of Object.entries(payload.coverage)) coverage.set(coveredFile, Number(value) || 0);
    }
    if (event.type === "network.request") {
      const url = String(payload.url || "");
      if (url) {
        addEdge(source || addNode({ id: "runtime:" + event.id, kind: "service", label: payload.service || "runtime request" }), addNode({ id: "api:" + url, kind: "api", label: url }), "calls", "runtime-trace");
        runtimeCorrelations += 1;
      }
    }
    if (event.type === "database.change") {
      const target = String(payload.target || "");
      if (target) {
        addEdge(source || addNode({ id: "runtime:" + event.id, kind: "service", label: payload.service || "database runtime" }), addNode({ id: "data:" + target, kind: "data", label: target }), payload.operation === "read" ? "reads" : "writes", "runtime-trace");
        runtimeCorrelations += 1;
      }
    }
    if (event.type === "trace.observed") {
      const caller = String(payload.callerFile || fileName || "");
      const callee = String(payload.calleeFile || "");
      if (nodeIds.has("file:" + caller) && nodeIds.has("file:" + callee)) {
        addEdge("file:" + caller, "file:" + callee, "traces", "otel-span");
        runtimeCorrelations += 1;
      }
    }
  }
  for (const test of nodes.filter((node) => node.kind === "test" && node.fileName).map((node) => node.fileName)) {
    for (const imported of imports.get(test) || []) addEdge("file:" + test, "file:" + imported, "tests");
    for (const covered of coverage.keys()) if (nodeIds.has("file:" + covered)) addEdge("file:" + test, "file:" + covered, "tests", "coverage-map");
  }
  const diagnostics = project.getPreEmitDiagnostics().filter((item) => {
    const text = item.getMessageText();
    const message = typeof text === "string" ? text : text.getMessageText();
    return !/Cannot find (?:name|module)|implicitly has an 'any' type/.test(message);
  }).length;
  return {
    files,
    nodes,
    edges,
    imports,
    symbols,
    coverage,
    diagnostics,
    runtimeCorrelations,
    engine: "ts-morph-compiler",
  };
}
function createDigitalTwin(payload, events = []) {
  const analysis = analyzeWorkspace(payload.files, events);
  const activeFile = String(payload.activeFile || "");
  const activeId = "file:" + activeFile;
  const affected = new Set();
  let frontier = [activeId];
  for (let depth = 0; depth < 4; depth += 1) {
    const next = [];
    for (const current of frontier) for (const edge of analysis.edges) {
      const neighbor = edge.source === current ? edge.target : edge.target === current ? edge.source : "";
      if (neighbor && !affected.has(neighbor) && neighbor !== activeId) {
        affected.add(neighbor);
        next.push(neighbor);
      }
    }
    frontier = next;
  }
  const affectedFiles = [...affected].filter((id) => id.startsWith("file:")).map((id) => id.slice(5));
  const testsToRun = analysis.nodes.filter((node) => node.kind === "test" && affected.has(node.id)).map((node) => node.fileName).filter(Boolean);
  const securityBoundaries = analysis.nodes.filter((node) => node.kind === "provider" || (node.fileName && (analysis.symbols.get(node.fileName)?.declarations || []).some((name) => /auth|token|permission|secret/i.test(name)))).map((node) => node.label);
  const activeNode = analysis.nodes.find((node) => node.id === activeId);
  const migrationsRequired = activeNode?.kind === "migration" || [...affected].some((id) => analysis.nodes.find((node) => node.id === id)?.kind === "migration")
    ? analysis.nodes.filter((node) => node.kind === "migration" && node.fileName).map((node) => node.fileName) : [];
  const apiConsumers = analysis.edges.filter((edge) => edge.target === activeId && edge.relation === "calls").map((edge) => edge.source.replace(/^file:/, ""));
  const telemetry = {
    traces: events.filter((event) => event.type === "trace.observed").length,
    requests: events.filter((event) => event.type === "network.request").length,
    databaseMutations: events.filter((event) => event.type === "database.change").length,
    deployments: events.filter((event) => event.type.startsWith("deployment.")).length,
  };
  const risks = [
    ...(analysis.diagnostics ? [analysis.diagnostics + " compiler diagnostic(s)"] : []),
    ...(activeNode?.kind === "api" ? ["API compatibility boundary"] : []),
    ...(migrationsRequired.length ? ["Data migration and rollback"] : []),
    ...(securityBoundaries.length ? ["Security boundary crossed"] : []),
    ...(!testsToRun.length ? ["No compiler- or coverage-linked test"] : []),
    ...(events.some((event) => event.type.endsWith("failed")) ? ["Historical runtime failures"] : []),
  ];
  const radius = affectedFiles.length + risks.length + apiConsumers.length;
  return {
    nodes: analysis.nodes,
    edges: analysis.edges,
    impact: {
      activeFile,
      affectedFiles,
      testsToRun,
      risks,
      blastRadius: radius >= 8 ? "high" : radius >= 4 ? "medium" : "low",
      securityBoundaries,
      migrationsRequired,
      apiConsumers,
      confidence: clamp(70 + Math.min(15, analysis.edges.length) + Math.min(10, analysis.runtimeCorrelations * 2) + Math.min(5, analysis.coverage.size)),
    },
    telemetry,
    analysis: {
      engine: analysis.engine,
      compilerDiagnostics: analysis.diagnostics,
      runtimeCorrelations: analysis.runtimeCorrelations,
      coverageFiles: [...analysis.coverage.keys()],
      symbolFiles: [...analysis.symbols.values()].filter((item) => item.declarations.length).length,
    },
    generatedAt: new Date().toISOString(),
  };
}
module.exports = { analyzeWorkspace, createDigitalTwin };
