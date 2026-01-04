const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'swagger.yaml');
const dest = path.join(__dirname, 'dist', 'swagger.yaml');

try {
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
  }
  fs.copyFileSync(source, dest);
  console.log('✓ swagger.yaml copied to dist/');
} catch (err) {
  console.error('✗ Failed to copy swagger.yaml:', err.message);
  process.exit(1);
}