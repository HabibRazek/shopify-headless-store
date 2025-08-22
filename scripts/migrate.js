const { exec } = require('child_process');

console.log('Running Prisma database migration...');

exec('npx prisma db push', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Success: ${stdout}`);
});
