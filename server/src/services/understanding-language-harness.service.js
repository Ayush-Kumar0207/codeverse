const path = require("path");
const languageAdapters = require("./evidence-language-adapters.service");

function fixtureScalar(fixture) {
  if (fixture === null) return -2147483647;
  if (Array.isArray(fixture) && fixture.length) return Number(fixture[0]) || 0;
  return Number(fixture) || 0;
}
function safeIdentifier(value) {
  const candidate = String(value || "");
  return /^[A-Za-z_$][\w$]*$/.test(candidate) ? candidate : "";
}
function slash(value) {
  return String(value || "").replace(/\\/g, "/");
}
function pythonHarness(fileName, primary, fixture, parameterCount) {
  const call = parameterCount ? "target(fixture)" : "target()";
  return [
    "import asyncio, importlib.util, inspect, json, pathlib",
    "candidate_path = pathlib.Path(__file__).parent.parent / " + JSON.stringify(slash(fileName)),
    "spec = importlib.util.spec_from_file_location('evidence_candidate', candidate_path)",
    "candidate = importlib.util.module_from_spec(spec)",
    "spec.loader.exec_module(candidate)",
    "target = getattr(candidate, " + JSON.stringify(primary) + ")",
    "fixture = json.loads(" + JSON.stringify(JSON.stringify(fixture)) + ")",
    "try:",
    "    value = " + call,
    "    if inspect.isawaitable(value): value = asyncio.run(value)",
    "    print('EVIDENCE_RESULT:' + json.dumps({'status':'returned','value':value}, default=str, sort_keys=True))",
    "except Exception as error:",
    "    print('EVIDENCE_RESULT:' + json.dumps({'status':'threw','name':type(error).__name__,'message':str(error)}, sort_keys=True))",
  ].join("\n");
}
function javaHarness(className, primary, fixture) {
  const scalar = fixtureScalar(fixture);
  const list = Array.isArray(fixture) ? fixture.map((item) => Number(item) || 0) : [];
  return `import java.lang.reflect.*;
import java.util.*;
public class EvidenceProbe {
  static Object argument(Class<?> type) {
    int scalar = ${scalar};
    if (type == int.class || type == Integer.class) return scalar;
    if (type == long.class || type == Long.class) return (long) scalar;
    if (type == double.class || type == Double.class) return (double) scalar;
    if (type == boolean.class || type == Boolean.class) return scalar != 0;
    if (type == String.class) return ${JSON.stringify(JSON.stringify(fixture))};
    if (type == int[].class) return new int[]{${list.join(",")}};
    if (List.class.isAssignableFrom(type)) return Arrays.asList(${list.join(",")});
    return null;
  }
  static String quote(String value) { StringBuilder result = new StringBuilder().append((char)34); for (char character : value.toCharArray()) { if (character == 34 || character == 92) result.append((char)92); if (character == 10) { result.append((char)92).append('n'); continue; } result.append(character); } return result.append((char)34).toString(); }
  static String jsonValue(Object value) {
    if (value == null) return "null";
    if (value instanceof Number || value instanceof Boolean) return String.valueOf(value);
    if (value.getClass().isArray()) return quote(Arrays.deepToString(new Object[]{value}));
    return quote(String.valueOf(value));
  }
  public static void main(String[] args) {
    try {
      Class<?> type = ${className}.class;
      Method target = Arrays.stream(type.getDeclaredMethods()).filter(method -> method.getName().equals(${JSON.stringify(primary)})).findFirst().orElseThrow();
      target.setAccessible(true);
      Object receiver = Modifier.isStatic(target.getModifiers()) ? null : type.getDeclaredConstructor().newInstance();
      Class<?>[] types = target.getParameterTypes();
      Object[] values = new Object[types.length];
      for (int index = 0; index < types.length; index++) values[index] = argument(types[index]);
      Object value = target.invoke(receiver, values);
      String q = String.valueOf((char)34); System.out.println("EVIDENCE_RESULT:{" + q + "status" + q + ":" + q + "returned" + q + "," + q + "value" + q + ":" + jsonValue(value) + "}");
    } catch (Throwable error) {
      Throwable cause = error instanceof InvocationTargetException && error.getCause() != null ? error.getCause() : error;
      String q = String.valueOf((char)34); System.out.println("EVIDENCE_RESULT:{" + q + "status" + q + ":" + q + "threw" + q + "," + q + "name" + q + ":" + quote(cause.getClass().getSimpleName()) + "," + q + "message" + q + ":" + quote(String.valueOf(cause.getMessage())) + "}");
    }
  }
}`;
}
function cHarness(fileName, primary, fixture, parameterCount) {
  const call = primary + "(" + (parameterCount ? fixtureScalar(fixture) : "") + ")";
  return `#include <stdio.h>
#define main evidence_candidate_main
#include "../${slash(fileName).replace(/"/g, "\\\"")}"
#undef main
int main(void) { long long value = (long long)(${call}); printf("EVIDENCE_RESULT:{\\\"status\\\":\\\"returned\\\",\\\"value\\\":%lld}\\n", value); return 0; }`;
}
function cppHarness(fileName, primary, fixture, parameterCount) {
  const call = primary + "(" + (parameterCount ? fixtureScalar(fixture) : "") + ")";
  return `#include <iostream>
#include <exception>
#define main evidence_candidate_main
#include "../${slash(fileName).replace(/"/g, "\\\"")}"
#undef main
int main() { try { auto value = ${call}; std::cout << "EVIDENCE_RESULT:{\\\"status\\\":\\\"returned\\\",\\\"value\\\":" << value << "}\\n"; } catch (const std::exception& error) { std::cout << "EVIDENCE_RESULT:{\\\"status\\\":\\\"threw\\\",\\\"name\\\":\\\"exception\\\",\\\"message\\\":\\\"" << error.what() << "\\\"}\\n"; } }`;
}
function goHarness(source, primary, fixture, parameterCount) {
  let candidate = source.replace(/^\s*package\s+\w+/m, "package main").replace(/\bfunc\s+main\s*\(/, "func evidenceCandidateMain(");
  let jsonAlias = "evidencejson";
  const existing = /(?:(\w+)\s+)?["']encoding\/json["']/.exec(candidate);
  if (existing) jsonAlias = existing[1] || "json";
  else candidate = candidate.replace(/package main\s*/, 'package main\nimport evidencejson "encoding/json"\n');
  const call = primary + "(" + (parameterCount ? fixtureScalar(fixture) : "") + ")";
  return candidate + `
func main() { value := ${call}; payload, _ := ${jsonAlias}.Marshal(map[string]interface{}{ "status": "returned", "value": value }); println("EVIDENCE_RESULT:" + string(payload)) }
`;
}
function rustHarness(source, primary, fixture, parameterCount) {
  const candidate = source.replace(/\bfn\s+main\s*\(/, "fn evidence_candidate_main(");
  const call = primary + "(" + (parameterCount ? fixtureScalar(fixture) : "") + ")";
  return candidate + `
fn main() { match std::panic::catch_unwind(|| ${call}) { Ok(value) => println!("EVIDENCE_RESULT:{{\\\"status\\\":\\\"returned\\\",\\\"value\\\":{:?}}}", value), Err(_) => println!("EVIDENCE_RESULT:{{\\\"status\\\":\\\"threw\\\",\\\"name\\\":\\\"panic\\\",\\\"message\\\":\\\"candidate panicked\\\"}}") } }
`;
}
function prepareLanguageProbe(files, fileName, source, analysis, fixture) {
  const language = languageAdapters.languageForFile(fileName);
  const primary = safeIdentifier(analysis.primary);
  if (!language || !primary) return null;
  const candidateFiles = { ...files, [fileName]: source };
  if (language === "python") {
    const runnerName = ".evidence/probe.py";
    return { files: { ...candidateFiles, [runnerName]: pythonHarness(fileName, primary, fixture, analysis.parameters.length) }, runnerName, language };
  }
  if (language === "java") {
    const className = safeIdentifier((analysis.declarations || []).find((item) => /^[A-Z]/.test(item)) || path.basename(fileName, path.extname(fileName)));
    if (!className) return null;
    const runnerName = "EvidenceProbe.java";
    return { files: { ...candidateFiles, [runnerName]: javaHarness(className, primary, fixture) }, runnerName, language };
  }
  if (language === "c") {
    const runnerName = ".evidence/probe.c";
    return { files: { ...candidateFiles, [runnerName]: cHarness(fileName, primary, fixture, analysis.parameters.length) }, runnerName, language };
  }
  if (language === "cpp") {
    const runnerName = ".evidence/probe.cpp";
    return { files: { ...candidateFiles, [runnerName]: cppHarness(fileName, primary, fixture, analysis.parameters.length) }, runnerName, language };
  }
  if (language === "go") {
    const runnerName = "evidence_probe.go";
    return { files: { ...candidateFiles, [runnerName]: goHarness(source, primary, fixture, analysis.parameters.length) }, runnerName, language };
  }
  if (language === "rust") {
    const runnerName = ".evidence_probe.rs";
    return { files: { ...candidateFiles, [runnerName]: rustHarness(source, primary, fixture, analysis.parameters.length) }, runnerName, language };
  }
  return null;
}

module.exports = { prepareLanguageProbe };
