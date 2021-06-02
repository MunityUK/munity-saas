const { exec } = require('child_process');
const os = require('os');

switch (os.type()) {
  case 'Windows_NT':
    run('database');
    break;
  case 'Darwin':
  case 'Linux':
    run('./database.sh');
    break;
  default:
    throw new Error('Unsupported OS found: ' + os.type());
}

function run(cmd) {
  const process = exec(cmd, { cwd: __dirname, windowsHide: true });

  process.stdout.on('data', (data) => {
    console.info(data);
  });

  process.stderr.on('data', (data) => {
    console.error(data);
  });
}
