const { diffLines } = require('diff');

function makePatch(oldCode, newCode) {
  const d = diffLines(oldCode, newCode);
  return d.map(part => ({
    added: part.added || false,
    removed: part.removed || false,
    value: part.value
  }));
}

// naive apply: for MVP we return newCode provided in suggestion
function applyPatchToCode(patch) {
  if (!patch || !patch.patchedCode) throw new Error('invalid patch');
  return patch.patchedCode;
}

module.exports = { makePatch, applyPatchToCode };
