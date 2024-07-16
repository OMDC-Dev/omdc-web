import { readFileSync, writeFileSync, writeFile } from 'fs';

// Define the file paths
const filePath = './package.json';
const metaFilePath = './public/meta.json';

// Read and parse the package.json file
const packageJson = JSON.parse(readFileSync(filePath, 'utf8'));

// Update the buildDate in packageJson
packageJson.buildDate = new Date().getTime();

// Write the updated packageJson back to the file
writeFileSync(filePath, JSON.stringify(packageJson, null, 2));

// Prepare the jsonData with the new buildDate
const jsonData = {
  buildDate: packageJson.buildDate,
};

// Convert jsonData to a JSON string
const jsonContent = JSON.stringify(jsonData);

// Write jsonContent to the meta.json file
writeFile(metaFilePath, jsonContent, 'utf8', (error) => {
  if (error) {
    console.log(
      'An error occurred while saving build date and time to meta.json',
    );
    return console.log(error);
  }

  console.log('Latest build date and time updated in meta.json file');
});
