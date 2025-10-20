const testString = '\\begin{figure}';
const regex = /\\begin\{([^}]+)\}\s*$/;

console.log('Test string:', testString);
console.log('Regex:', regex);
console.log('Match result:', testString.match(regex));

if (testString.match(regex)) {
  console.log('Environment:', testString.match(regex)[1]);
}