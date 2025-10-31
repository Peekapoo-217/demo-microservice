const fs = require('fs');
const path = require('path');

const services = [
  { name: 'auth-service', path: './auth-service' },
  { name: 'book-service', path: './book-service' },
  { name: 'borrow-service', path: './borrow-service' }
];

services.forEach(service => {
  const distPath = path.join(__dirname, service.path, 'dist');
  const mainPath = path.join(distPath, 'main.js');

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const content = `require('./${service.name}/src/main');\n`;
  fs.writeFileSync(mainPath, content);

  console.log(`Created redirect for ${service.name}`);
});

console.log('\nAll redirects created successfully!');
