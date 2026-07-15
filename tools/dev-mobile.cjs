const net = require('node:net');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { Tunnel } = require('cloudflared');

const host = '127.0.0.1';
const port = Number(process.env.PORT || 4321);
const localUrl = `http://${host}:${port}`;
const astroCli = path.join(
  process.cwd(),
  'node_modules',
  'astro',
  'bin',
  'astro.mjs',
);

let astroProcess;
let startedAstro = false;
let tunnel;
let shuttingDown = false;

function isPortOpen() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(500);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForAstro(timeoutMs = 20_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isPortOpen()) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Astro did not start on ${localUrl} within 20 seconds.`);
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  tunnel?.stop();
  astroProcess?.kill('SIGINT');
  if (startedAstro) {
    spawnSync(process.execPath, [astroCli, 'dev', 'stop'], { stdio: 'ignore' });
  }

  setTimeout(() => process.exit(exitCode), 500).unref();
}

async function main() {
  if (!(await isPortOpen())) {
    startedAstro = true;
    astroProcess = spawn(
      process.execPath,
      [astroCli, 'dev', '--host', host, '--port', String(port)],
      { stdio: 'inherit', shell: false },
    );
    astroProcess.once('exit', (code) => {
      if (!shuttingDown && code && code !== 0) shutdown(code);
    });
    await waitForAstro();
  } else {
    console.log(`[mobile] Reusing the Astro server already running at ${localUrl}`);
  }

  tunnel = Tunnel.quick(localUrl, {
    '--http-host-header': `${host}:${port}`,
  });

  tunnel.once('url', (url) => {
    console.log('\n[mobile] Open this HTTPS address on your phone or tablet:');
    console.log(`${url}/booking/\n`);
  });
  tunnel.once('connected', () => {
    console.log('[mobile] Secure tunnel connected. Press Ctrl+C to stop it.');
  });
  tunnel.on('error', (error) => {
    console.error(`[mobile] Tunnel error: ${error.message}`);
    shutdown(1);
  });
  tunnel.once('exit', (code) => {
    if (!shuttingDown) shutdown(code ?? 1);
  });
}

process.once('SIGINT', () => shutdown(0));
process.once('SIGTERM', () => shutdown(0));

main().catch((error) => {
  console.error(`[mobile] ${error.message}`);
  shutdown(1);
});
