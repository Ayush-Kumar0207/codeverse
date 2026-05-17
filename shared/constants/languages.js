const SUPPORTED_LANGUAGES = Object.freeze([
  "javascript",
  "typescript",
  "python",
  "cpp",
  "c",
  "java",
  "html",
  "css",
  "markdown",
  "json",
  "plaintext",
]);

const LANGUAGE_FILE_MAP = Object.freeze({
  javascript: "script.js",
  python: "main.py",
  cpp: "main.cpp",
  c: "main.c",
  java: "Main.java",
  typescript: "main.ts",
  html: "index.html",
  css: "style.css",
  markdown: "README.md",
  json: "data.json",
  plaintext: "notes.txt",
});

const DEFAULT_LANGUAGE_FILES = Object.freeze({
  "index.html": "<!DOCTYPE html>\n<html>\n<head><title>New Project</title></head><body>\n<h1>Hello World!</h1>\n</body></html>",
  "style.css": "body {\n  font-family: sans-serif;\n}",
  "script.js": "console.log('Hello JS');",
  "README.md": "# Welcome to CodeVerse\n\nEdit your markdown here.",
  "main.py": "print('Hello Python')",
  "main.cpp": "#include<iostream>\nint main(){ std::cout << \"Hello C++\"; return 0; }",
  "main.c": "#include<stdio.h>\nint main(){ printf(\"Hello C\"); return 0; }",
  "Main.java": "public class Main { public static void main(String[] args) { System.out.println(\"Hello Java\"); } }",
  "main.ts": "const message: string = 'Hello TypeScript';\nconsole.log(message);",
  "data.json": "{\n  \"ready\": true\n}",
  "notes.txt": "CodeVerse notes\n",
});

module.exports = {
  SUPPORTED_LANGUAGES,
  LANGUAGE_FILE_MAP,
  DEFAULT_LANGUAGE_FILES,
};

