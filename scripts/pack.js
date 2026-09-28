const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const releasesDir = path.join(root, 'releases');
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

const packages = ['utils', 'shared-ui', 'cashier', 'profile', 'auth', 'game'];

for (const pkg of packages) {
  const pkgDir = path.join(root, 'packages', pkg);
  console.log(`Packing ${pkg}...`);
  try {
    const output = execSync(`npm pack --pack-destination "${releasesDir}"`, {
      cwd: pkgDir,
      encoding: 'utf8'
    });
    console.log(`  -> ${output.trim()}`);
  } catch (e) {
    console.error(`Failed to pack ${pkg}:`, e.message);
  }
}
console.log('Packing complete! Releases directory contents:');
console.log(fs.readdirSync(releasesDir));
