const net = require('net');

/**
 * Scan a list of ports for a host using TCP connect with timeout.
 * Returns: { checkedPorts: [{ port, open: boolean, error: string|null }], durationMs }
 */
function checkPort(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = null; // open, closed, timeout, error
    const onDone = (open, errMsg = null) => {
      if (!socket.destroyed) socket.destroy();
      resolve({ port, open, error: errMsg });
    };

    socket.setTimeout(timeoutMs);

    socket.on('connect', function () {
      onDone(true, null);
    });
    socket.on('timeout', function () {
      onDone(false, 'timeout');
    });
    socket.on('error', function (err) {
      onDone(false, err.message);
    });
    socket.on('close', function (hadError) {
      // handled in other callbacks
    });

    socket.connect(port, host);
  });
}

async function scanPorts(domain, ports = [80, 443], timeoutMs = 2000) {
  const start = Date.now();
  const checks = ports.map(p => checkPort(domain, p, timeoutMs));
  const results = await Promise.all(checks);
  return {
    checkedPorts: results.map(r => ({ port: r.port, open: r.open, error: r.error })),
    durationMs: Date.now() - start
  };
}

module.exports = scanPorts;
