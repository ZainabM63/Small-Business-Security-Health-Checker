const express = require('express');
const router = express.Router();

const checkHttps = require('../utils/checkHttps');
const checkHeaders = require('../utils/checkHeaders');
const scanPorts = require('../utils/scanPorts');

function normalizeDomain(input) {
  // Remove spaces and protocols, return host only
  if (!input) return null;
  let d = input.trim();
  d = d.replace(/^https?:\/\//i, '');
  d = d.replace(/\/.*$/, '');
  return d;
}

router.post('/', async (req, res) => {
  try {
    const { domain: rawDomain } = req.body;
    const domain = normalizeDomain(rawDomain);
    if (!domain) return res.status(400).json({ error: 'domain is required' });

    // Run checks in parallel where possible
    const httpsPromise = checkHttps(domain);
    const headersPromise = checkHeaders(domain);
    const portsPromise = scanPorts(domain, [21, 22, 25, 80, 443, 3306]); // common ports for MVP

    const [httpsResult, headersResult, portsResult] = await Promise.all([
      httpsPromise,
      headersPromise,
      portsPromise
    ]);

    // Simple scoring: each positive check adds points
    let score = 0;
    const totalChecks = 1 /* https */ + 1 /* hsts */ + headersResult.checkedHeaders.length + portsResult.checkedPorts.length;
    // https
    if (httpsResult.https) score += 1;
    if (httpsResult.hsts) score += 1;

    // headers
    headersResult.checkedHeaders.forEach(h => { if (h.present) score += 1; });

    // ports: prefer closed for sensitive ports
    portsResult.checkedPorts.forEach(p => { if (!p.open) score += 1; });

    const percent = Math.round((score / totalChecks) * 100);

    res.json({
      domain,
      timestamp: new Date().toISOString(),
      https: httpsResult,
      headers: headersResult,
      ports: portsResult,
      score: {
        raw: score,
        outOf: totalChecks,
        percent
      }
    });
  } catch (err) {
    console.error('Scan error', err);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

module.exports = router;
// Allow browser GET testing: /api/scan/example.com
router.get('/:domain', async (req, res) => {
  try {
    const rawDomain = req.params.domain;
    const domain = normalizeDomain(rawDomain);
    if (!domain) return res.status(400).json({ error: 'domain is required' });

    // Run the same checks
    const [httpsResult, headersResult, portsResult] = await Promise.all([
      checkHttps(domain),
      checkHeaders(domain),
      scanPorts(domain, [21, 22, 25, 80, 443, 3306])
    ]);

    let score = 0;
    const totalChecks = 1 + 1 + headersResult.checkedHeaders.length + portsResult.checkedPorts.length;
    if (httpsResult.https) score += 1;
    if (httpsResult.hsts) score += 1;
    headersResult.checkedHeaders.forEach(h => { if (h.present) score += 1; });
    portsResult.checkedPorts.forEach(p => { if (!p.open) score += 1; });

    const percent = Math.round((score / totalChecks) * 100);

    res.json({
      domain,
      timestamp: new Date().toISOString(),
      https: httpsResult,
      headers: headersResult,
      ports: portsResult,
      score: {
        raw: score,
        outOf: totalChecks,
        percent
      }
    });
  } catch (err) {
    console.error('GET scan error', err);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});
