const path = require("path");
const astGrep = require("@ast-grep/napi");

const DYNAMIC_LANGUAGES = {
  python: require("@ast-grep/lang-python"),
  java: require("@ast-grep/lang-java"),
  c: require("@ast-grep/lang-c"),
  cpp: require("@ast-grep/lang-cpp"),
  go: require("@ast-grep/lang-go"),
  rust: require("@ast-grep/lang-rust"),
};

astGrep.registerDynamicLanguage(DYNAMIC_LANGUAGES);

const CONFIG = {
  python: {
    extensions: new Set([".py"]),
    declarations: new Set(["function_definition", "class_definition"]),
    calls: new Set(["call"]),
    imports: new Set(["import_statement", "import_from_statement"]),
    returns: new Set(["return_statement"]),
    parameters: new Set(["typed_parameter", "default_parameter", "typed_default_parameter", "list_splat_pattern", "dictionary_splat_pattern"]),
  },
  java: {
    extensions: new Set([".java"]),
    declarations: new Set(["method_declaration", "constructor_declaration", "class_declaration", "interface_declaration", "enum_declaration", "record_declaration"]),
    calls: new Set(["method_invocation", "object_creation_expression"]),
    imports: new Set(["import_declaration"]),
    returns: new Set(["return_statement"]),
    parameters: new Set(["formal_parameter", "spread_parameter"]),
  },
  c: {
    extensions: new Set([".c", ".h"]),
    declarations: new Set(["function_definition", "struct_specifier", "enum_specifier", "type_definition"]),
    calls: new Set(["call_expression"]),
    imports: new Set(["preproc_include"]),
    returns: new Set(["return_statement"]),
    parameters: new Set(["parameter_declaration"]),
  },
  cpp: {
    extensions: new Set([".cc", ".cpp", ".cxx", ".hh", ".hpp", ".hxx"]),
    declarations: new Set(["function_definition", "class_specifier", "struct_specifier", "enum_specifier", "namespace_definition", "type_definition"]),
    calls: new Set(["call_expression"]),
    imports: new Set(["preproc_include", "module_import_declaration"]),
    returns: new Set(["return_statement"]),
    parameters: new Set(["parameter_declaration", "optional_parameter_declaration"]),
  },
  go: {
    extensions: new Set([".go"]),
    declarations: new Set(["function_declaration", "method_declaration", "type_declaration"]),
    calls: new Set(["call_expression"]),
    imports: new Set(["import_declaration", "import_spec"]),
    returns: new Set(["return_statement"]),
    parameters: new Set(["parameter_declaration", "variadic_parameter_declaration"]),
  },
  rust: {
    extensions: new Set([".rs"]),
    declarations: new Set(["function_item", "struct_item", "enum_item", "trait_item", "impl_item", "mod_item"]),
    calls: new Set(["call_expression", "macro_invocation"]),
    imports: new Set(["use_declaration", "mod_item", "extern_crate_declaration"]),
    returns: new Set(["return_expression"]),
    parameters: new Set(["parameter", "self_parameter"]),
  },
};

function languageForFile(fileName) {
  const extension = path.extname(String(fileName || "")).toLowerCase();
  return Object.entries(CONFIG).find(([, config]) => config.extensions.has(extension))?.[0] || null;
}

function walk(root, limit = 20_000) {
  const nodes = [];
  const pending = [root];
  while (pending.length && nodes.length < limit) {
    const current = pending.pop();
    nodes.push(current);
    const children = current.children();
    for (let index = children.length - 1; index >= 0; index -= 1) pending.push(children[index]);
  }
  return nodes;
}

function identifier(node) {
  const direct = node.field("name") || node.field("declarator") || node.field("function");
  if (direct) {
    const candidate = direct.field?.("name") || direct;
    const match = /[A-Za-z_$][\w$]*/.exec(candidate.text());
    if (match) return match[0];
  }
  const named = walk(node, 200).find((item) => ["identifier", "type_identifier", "field_identifier", "scoped_identifier"].includes(item.kind()));
  return named?.text() || "";
}

function unquote(value) {
  return String(value || "").trim().replace(/^[<"']|[>"'];?$/g, "");
}

function importRequest(language, text) {
  if (language === "python") {
    const from = /^\s*from\s+([.\w]+)/.exec(text);
    const direct = /^\s*import\s+([.\w]+)/.exec(text);
    return (from || direct)?.[1] || "";
  }
  if (language === "java") return text.replace(/^\s*import\s+(?:static\s+)?/, "").replace(/;\s*$/, "").trim();
  if (language === "c" || language === "cpp") return unquote(text.replace(/^\s*#\s*include\s*/, ""));
  if (language === "go") return unquote(text.replace(/^\s*import\s*(?:\(\s*)?/, "").split(/\s+/).at(-1));
  if (language === "rust") return text.replace(/^\s*(?:pub\s+)?(?:use|mod|extern\s+crate)\s+/, "").replace(/[;{].*$/, "").trim();
  return "";
}

function analyzeLanguageFile(fileName, source) {
  const language = languageForFile(fileName);
  if (!language) return null;
  const root = astGrep.parse(language, String(source || "")).root();
  const nodes = walk(root);
  const config = CONFIG[language];
  const declarations = [], calls = [], parameters = [], imports = [];
  const markers = [];
  let returns = 0;
  const diagnostics = [];
  for (const node of nodes) {
    const kind = node.kind();
    if (kind === "ERROR" || kind === "MISSING") {
      const range = node.range();
      diagnostics.push({ message: "Parser rejected " + node.text().slice(0, 120), line: range.start.line + 1, column: range.start.column + 1 });
    }
    if (config.declarations.has(kind)) {
      const name = identifier(node);
      if (name) declarations.push(name);
      const parameterList = node.field("parameters");
      if (parameterList) {
        for (const parameter of walk(parameterList, 300).filter((item) => item.kind() === "identifier")) parameters.push(parameter.text());
      }
    }
    if (config.calls.has(kind)) {
      const target = node.field("function") || node.field("name") || node.field("macro");
      calls.push((target?.text() || node.text().split(/[({!]/)[0]).trim().slice(0, 180));
    }
    if (config.imports.has(kind)) {
      const request = importRequest(language, node.text());
      if (request) imports.push(request);
    }
    if (config.returns.has(kind)) returns += 1;
    if (config.parameters.has(kind)) {
      const name = identifier(node);
      if (name) parameters.push(name);
    }
    if (/(?:annotation|decorator|attribute_item|attribute)$/.test(kind)) markers.push(node.text().slice(0, 180));

  }
  return {
    engine: "tree-sitter-ast-grep",
    language,
    declarations: [...new Set(declarations)].slice(0, 100),
    calls: [...new Set(calls)].slice(0, 200),
    parameters: [...new Set(parameters)].slice(0, 100),
    imports: [...new Set(imports)].slice(0, 100),
    markers: [...new Set(markers)].slice(0, 100),
    returns,
    diagnostics,
    nodeCount: nodes.length,
  };
}

function resolveLanguageImport(sourceName, request, names, language) {
  const sourceDirectory = path.posix.dirname(sourceName);
  const normalized = request.replace(/^crate::/, "").replace(/::/g, "/").replace(/\./g, "/");
  const candidates = new Set([
    path.posix.normalize(path.posix.join(sourceDirectory, normalized)),
    path.posix.normalize(normalized),
    request,
  ]);
  for (const name of names) {
    const stem = name.replace(/\.[^.]+$/, "");
    const base = path.posix.basename(stem);
    if (candidates.has(name) || candidates.has(stem) || [...candidates].some((candidate) => stem === candidate || stem.endsWith("/" + candidate) || base === path.posix.basename(candidate))) return name;
    if ((language === "c" || language === "cpp") && path.posix.basename(name) === path.posix.basename(request)) return name;
    if (language === "java" && path.posix.basename(stem) === request.split(".").at(-1)) return name;
  }
  return null;
}

module.exports = { analyzeLanguageFile, languageForFile, resolveLanguageImport };
