const fs = require('fs');
const path = require('path');

// Read the JS files and extract the object
function convertToJson(inputFile, outputFile) {
  const content = fs.readFileSync(inputFile, 'utf8');
  
  // Remove export statement and extract the object
  const objectMatch = content.match(/export const \w+ = (\{[\s\S]*\});?$/);
  
  if (objectMatch) {
    try {
      // Use eval to parse the JavaScript object literal
      const obj = eval('(' + objectMatch[1] + ')');
      
      // Write as JSON
      fs.writeFileSync(outputFile, JSON.stringify(obj, null, 2));
      console.log(`✅ Converted ${inputFile} to ${outputFile}`);
    } catch (error) {
      console.error(`❌ Error converting ${inputFile}:`, error.message);
    }
  } else {
    console.error(`❌ Could not find export in ${inputFile}`);
  }
}

// Convert all translation files
const translationsDir = path.join(__dirname, '..', 'translations');
const messagesDir = path.join(__dirname, '..', 'messages');

// Ensure messages directory exists
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir);
}

// Convert each file
['en', 'fr', 'es', 'zh'].forEach(locale => {
  const inputFile = path.join(translationsDir, `${locale}.js`);
  const outputFile = path.join(messagesDir, `${locale}.json`);
  
  if (fs.existsSync(inputFile)) {
    convertToJson(inputFile, outputFile);
  } else {
    console.log(`⚠️ ${inputFile} not found`);
  }
});

console.log('\n✨ Conversion complete!');