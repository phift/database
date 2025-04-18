const fs = require('fs');
const path = require('path');
const jsonlint = require('jsonlint');

function validateJsonFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const parsedJson = jsonlint.parse(fileContent);

    // Check for exact string "sample" (case-insensitive, including the quotes)
    if (fileContent.toLowerCase().includes('"sample"')) {
      console.error(`Validation failed for '${filePath}': Found forbidden string "sample" (with quotes, case-insensitive).`);
      process.exit(1);
    }

    // Check for invalid value-supported combinations
    checkInvalidValueSupportedCombination(parsedJson, filePath);

    // Check formatting
    if (JSON.stringify(parsedJson, null, 2) === fileContent) {
      console.log(`JSON file '${filePath}' is valid.`);
    } else {
      console.error(`Error in JSON file '${filePath}': The JSON is not well-formatted.`);
      process.exit(1); // Exit with a non-zero status code
    }
  } catch (error) {
    console.error(`Error in JSON file '${filePath}':`, error.message);
    process.exit(1); // Exit with a non-zero status code
  }
}

function checkInvalidValueSupportedCombination(obj, filePath) {
  if (typeof obj !== 'object' || obj === null) return;

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'object' && value !== null) {
      // Check directly if it has both 'value' and 'supported' keys
      if ('value' in value && 'supported' in value) {
        const val = value['value'];
        const supported = value['supported'];

        if ((val === 'YES' && supported === false) || (val === 'NO' && supported === true)) {
          console.error(`❌ Validation failed in '${filePath}': Invalid combination in key "${key}". Found: value="${val}", supported=${supported}`);
          process.exit(1);
        }
      }

      // Recursively check nested objects
      checkInvalidValueSupportedCombination(value, filePath);
    }
  }
}

const itemTypesDir = '../item-types';

fs.readdirSync(itemTypesDir, { withFileTypes: true }).forEach((entry) => {
  if (entry.isDirectory()) {
    const itemsDir = path.join(itemTypesDir, entry.name, 'items');

    if (fs.existsSync(itemsDir)) {
      fs.readdirSync(itemsDir).forEach((file) => {
        if (file.endsWith('.json')) {
          const filePath = path.join(itemsDir, file);
          validateJsonFile(filePath);
        }
      });
    }
  }
});

console.log("*** JSONs validation finished OK ***");
