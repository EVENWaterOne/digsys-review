import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const sourcePath = new URL("../src/data/studyModules.ts", import.meta.url);
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
});

const sandbox = {
  exports: {},
  module: { exports: {} },
};
vm.createContext(sandbox);
vm.runInContext(compiled.outputText, sandbox, { filename: "studyModules.ts" });

const studyModules = sandbox.module.exports.studyModules ?? sandbox.exports.studyModules;
const problems = [];

if (!Array.isArray(studyModules) || studyModules.length === 0) {
  problems.push("studyModules must be a non-empty array.");
}

for (const module of studyModules ?? []) {
  const prefix = module?.id ?? "<missing id>";
  for (const field of ["titleZh", "summaryZh", "workedExampleZh"]) {
    if (typeof module?.[field] !== "string" || module[field].trim() === "") {
      problems.push(`${prefix}: missing ${field}`);
    }
  }

  if (!Array.isArray(module?.keyPointsZh)) {
    problems.push(`${prefix}: keyPointsZh must be an array`);
  } else if (module.keyPoints.length !== module.keyPointsZh.length) {
    problems.push(`${prefix}: keyPoints/keyPointsZh length mismatch`);
  }

  if (!Array.isArray(module?.commonTrapsZh)) {
    problems.push(`${prefix}: commonTrapsZh must be an array`);
  } else if (module.commonTraps.length !== module.commonTrapsZh.length) {
    problems.push(`${prefix}: commonTraps/commonTrapsZh length mismatch`);
  }
}

if (problems.length > 0) {
  console.error("Study module validation failed:");
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

console.log(`Study module validation passed: ${studyModules.length} bilingual modules.`);
