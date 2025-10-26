// Test the fixes for table generation
const latexExample = `\\begin{tabular}{|c|c|c|c|}
\\hline
cell & cell & cell & cell \\\\
\\hline
cell & cell & cell & cell \\\\
\\hline
cell & cell & cell & cell \\\\
\\hline
cell & cell & cell & cell \\\\
\\hline
\\end{tabular}`;

console.log('=== Test 1: Fix for {|c|c|c|c|} in first cell ===\n');

// OLD REGEX (broken):
const oldContentMatch = latexExample.match(/\}([\s\S]*?)\\end\{tabular\}/);
console.log('OLD REGEX - First cell would contain:', JSON.stringify(oldContentMatch[1].split(/\s*\\\\\s*/)[0]));

// NEW REGEX (fixed):
const newContentMatch = latexExample.match(/\\begin\{tabular\}[^}]*\}([\s\S]*?)\\end\{tabular\}/);
console.log('NEW REGEX - First cell now contains:', JSON.stringify(
  newContentMatch[1]
    .split(/\s*\\\\\s*/)
    .map(r => r.replace(/\\hline\s*/g, '').trim())
    .filter(r => r.length > 0)[0]
    .split(/\s*&\s*/)[0]
));

console.log('\n=== Test 2: Fill value support ===\n');

const parseInlineTableDimensions = (raw) => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed.length) {
    return null;
  }

  // Check if it contains '=' anywhere for fill mode
  const hasEquals = trimmed.includes('=');
  let fillMode = false;
  let fillValue = 'x';
  let dimensionPart = trimmed;
  
  if (hasEquals) {
    // Find the first '=' and split
    const equalsIndex = trimmed.indexOf('=');
    dimensionPart = trimmed.slice(0, equalsIndex).trim();
    const valuePart = trimmed.slice(equalsIndex + 1).trim();
    fillValue = valuePart || ' '; // default to space if nothing after =
    fillMode = true;
  }

  const match = dimensionPart.match(/^([1-9]\d?)\s*[xX]\s*([1-9]\d?)$/);
  if (!match) {
    return null;
  }

  let rows = Number.parseInt(match[1], 10);
  let columns = Number.parseInt(match[2], 10);

  return {
    rows,
    columns,
    fillMode,
    fillValue
  };
};

const test1 = parseInlineTableDimensions('4x4');
console.log('Input: "4x4"');
console.log('  fillMode:', test1.fillMode, 'fillValue:', test1.fillValue);

const test2 = parseInlineTableDimensions('4x4 =0');
console.log('\nInput: "4x4 =0"');
console.log('  fillMode:', test2.fillMode, 'fillValue:', test2.fillValue);

const test3 = parseInlineTableDimensions('3x3 =X');
console.log('\nInput: "3x3 =X"');
console.log('  fillMode:', test3.fillMode, 'fillValue:', test3.fillValue);

console.log('\n=== Test 3: LaTeX table generation with fill value ===\n');

const generateLatexTable = (rows, columns, fillValue) => {
  const columnSpec = Array(columns).fill('c').join('|');
  const cellContent = fillValue;
  const rows_array = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, colIndex) => cellContent)
      .join(' & ')
  );

  const latexTable = [
    '\\begin{tabular}{|' + columnSpec + '|}',
    '\\hline',
    rows_array.map(row => row + ' \\\\').join('\n\\hline\n'),
    '\\hline',
    '\\end{tabular}'
  ].join('\n');
  
  return latexTable;
};

console.log('2x2 table filled with "0":');
console.log(generateLatexTable(2, 2, '0'));

console.log('\n2x2 table filled with "cell":');
console.log(generateLatexTable(2, 2, 'cell'));
