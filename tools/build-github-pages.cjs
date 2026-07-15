const { spawnSync } = require('node:child_process');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const [script = 'build', ...args] = process.argv.slice(2);
const result = spawnSync(npm, ['run', script, ...(args.length ? ['--', ...args] : [])], {
  stdio: 'inherit',
  env: { ...process.env, ASTRO_BASE: '/maidathome' },
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
