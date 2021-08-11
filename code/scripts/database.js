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
  const cp = exec(cmd, { cwd: __dirname, windowsHide: true });
  cp.stdout.on('data', (data) => {
    console.info(data.trim());
  });
  cp.stderr.on('data', console.error);
  cp.on('exit', () => console.info('Container started.'));
}
