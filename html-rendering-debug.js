// Test what renderMarkdownToHtml outputs with inline HTML
// Run this in the browser console

const testMarkdown = `
# Test

This is a test:

<div style="background: red; color: white; padding: 20px;">
  <h3>Hello</h3>
  <p>This is HTML</p>
</div>

More text
`;

console.log("=== Testing renderMarkdownToHtml ===");
const result = renderMarkdownToHtml(testMarkdown, null, { collectSourceMap: false });
console.log("HTML output:", result.html);
console.log("Contains <div>:", result.html.includes("<div"));
console.log("Contains &lt;div&gt;:", result.html.includes("&lt;div"));
console.log("Full output:", result);

// Test marked.js directly
console.log("\n=== Testing marked directly ===");
const markedOutput = window.marked.parse(testMarkdown);
console.log("Marked output:", markedOutput);
console.log("Contains <div>:", markedOutput.includes("<div"));
console.log("Contains &lt;div&gt;:", markedOutput.includes("&lt;div"));

// Test DOMPurify
console.log("\n=== Testing DOMPurify ===");
const config = {
  ADD_TAGS: ['section', 'header', 'article', 'mark', 'script', 'iframe', 'div', 'span', 'button', 'form', 'input', 'textarea', 'label', 'select', 'option', 'fieldset', 'legend', 'details', 'summary', 'nav', 'aside', 'footer'],
  ADD_ATTR: ['onclick', 'onload', 'onchange', 'onsubmit', 'onmouseover', 'onmouseout', 'placeholder', 'value', 'checked', 'selected', 'disabled', 'readonly', 'required', 'name', 'class', 'style']
};
const testHtml = '<div style="background: red;"><p>Test</p></div>';
const sanitized = window.DOMPurify.sanitize(testHtml, config);
console.log("Sanitized output:", sanitized);
console.log("Contains <div>:", sanitized.includes("<div"));
console.log("Contains &lt;div&gt;:", sanitized.includes("&lt;div"));
