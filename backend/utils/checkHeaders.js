const axios = require('axios');

/**
 * Check presence of important security headers.
 * Returns:
 * {
 *   checkedHeaders: [{ name, present, value|null }],
 *   serverHeader: string|null,
 *   note: string|null
 * }
 */
async function checkHeaders(domain) {
  // We'll try HTTPS first, then HTTP if HTTPS not present
  const tryUrls = [`https://${domain}/`, `http://${domain}/`];

  let resp = null;
  for (const url of tryUrls) {
    try {
      resp = await axios.get(url, { timeout: 8000, maxRedirects: 5, validateStatus: null });
      if (resp) break;
    } catch (err) {
      // continue to next
    }
  }

  if (!resp || !resp.headers) {
    return {
      checkedHeaders: [
        { name: 'Content-Security-Policy', present: false, value: null },
        { name: 'X-Content-Type-Options', present: false, value: null },
        { name: 'X-Frame-Options', present: false, value: null },
        { name: 'Referrer-Policy', present: false, value: null },
        { name: 'Permissions-Policy', present: false, value: null }
      ],
      serverHeader: null,
      note: 'Could not fetch headers'
    };
  }

  const h = resp.headers;
  const headersToCheck = [
    'content-security-policy',
    'x-content-type-options',
    'x-frame-options',
    'referrer-policy',
    'permissions-policy' // sometimes called feature-policy in older servers
  ];

  const checkedHeaders = headersToCheck.map(name => {
    return {
      name,
      present: typeof h[name] === 'string',
      value: h[name] || null
    };
  });

  return {
    checkedHeaders,
    serverHeader: h['server'] || null,
    note: null
  };
}

module.exports = checkHeaders;
