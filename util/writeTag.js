function writeStyle(writable, path) {
  writable.write('<link rel="stylesheet" href="' + path + '">');
}

function writeScript(writable, path) {
  writable.write('<script src="' + path + '"></script>');
}

function writeTag(writable, tag, text, attr) {
  const attrs = concatAttr(attr);
  writable.write('<' + tag + ' ' + attrs + '>' + text + '</' + tag + '>');
}

function writeTagStart(writable, tag, attr) {
  const attrs = concatAttr(attr);
  writable.write('<' + tag + ' ' + attrs + '>');
}

function writeTagEnd(writable, tag) {
  writable.write('</' + tag + '>');
}

function concatAttr(attr = {}) {
  return Object.entries(attr)
    .map(([key, value]) => key + ':"' + value + '"')
    .join(' ');
}

module.exports = {
  writeStyle,
  writeScript,
  writeTag,
  writeTagStart,
  writeTagEnd
};
