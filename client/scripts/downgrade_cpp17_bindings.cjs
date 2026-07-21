const fs = require("fs");
const path = require("path");
const files = [
  path.resolve(__dirname, "../data/algos/generated_cpp_approaches.json"),
  path.resolve(__dirname, "../data/algos/curated_cpp_variants.json"),
];

function declarations(names, item, indent) {
  const values = names.split(",").map((name) => name.trim());
  if (values.length === 2) {
    return `${indent}auto ${values[0]} = ${item}.first;\n${indent}auto ${values[1]} = ${item}.second;`;
  }
  return values.map((name, index) => `${indent}auto ${name} = get<${index}>(${item});`).join("\n");
}

function convert(code, identifier) {
  let sequence = 0;

  code = code.replace(/^([ \t]*)auto \[([^\]]+)\] = ([^;]+);/gm, (_, indent, names, expression) => {
    const item = `codeverseItem${sequence++}`;
    return `${indent}auto ${item} = ${expression};\n${declarations(names, item, indent)}`;
  });

  code = code.replace(/for \(auto \[([^\]]+)\] : (.+)\) \{/g, (_, names, expression) => {
    const item = `codeverseItem${sequence++}`;
    return `for (const auto& ${item} : ${expression}) {\n${declarations(names, item, "        ")}`;
  });

  code = code.replace(
    /for \(auto \[value, frequency\] : count\)\n\s*if \(frequency == 1\)\n\s*return value;/g,
    () => {
      const item = `codeverseItem${sequence++}`;
      return `for (const auto& ${item} : count) {\n        auto value = ${item}.first;\n        auto frequency = ${item}.second;\n        if (frequency == 1)\n            return value;\n    }`;
    }
  );

  code = code.replace(
    /for \(auto \[next, weight\] : graph\[node\]\)\n\s*if \(!seen\[next\]\)\n\s*explore\(next, target, cost \+ weight, graph, seen, best, ways\);/g,
    () => {
      const item = `codeverseItem${sequence++}`;
      return `for (const auto& ${item} : graph[node]) {\n        auto next = ${item}.first;\n        auto weight = ${item}.second;\n        if (!seen[next])\n            explore(next, target, cost + weight, graph, seen, best, ways);\n    }`;
    }
  );

  code = code.replace(
    /for \(auto \[([^\]]+)\] : (.+)\)\n([ \t]+)([^\n]+;)/g,
    (_, names, expression, indent, statement) => {
      const item = `codeverseItem${sequence++}`;
      return `for (const auto& ${item} : ${expression}) {\n${declarations(names, item, indent)}\n${indent}${statement.trim()}\n    }`;
    }
  );

  if (/auto \[/.test(code)) {
    const remaining = code.split("\n").find((line) => /auto \[/.test(line));
    throw new Error(`A structured binding could not be converted in ${identifier}: ${remaining}`);
  }
  return code;
}

let changed = 0;
for (const filename of files) {
  const catalog = JSON.parse(fs.readFileSync(filename, "utf8"));
  for (const [algorithmId, approaches] of Object.entries(catalog)) {
    for (const approach of approaches) {
      const next = convert(approach.code, `${algorithmId}/${approach.name}`);
      if (next !== approach.code) {
        approach.code = next;
        changed += 1;
      }
    }
  }
  fs.writeFileSync(filename, `${JSON.stringify(catalog, null, 2)}\n`);
}
console.log(`Converted structured bindings in ${changed} C++ approaches.`);
