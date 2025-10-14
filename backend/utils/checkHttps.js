const axios = require('axios');

/**
 * Performs an HTTPS fetch to determine if HTTPS is available and checks for HSTS header.
 * Returns: { https: boolean, httpsError: string|null, hsts: boolean, certificateValid: boolean|null, statusCode: number|null }
 */
async function checkHttps(domain) {
  const url = `https://${domain}/`;
  try {
    const resp = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      validateStatus: null // we want to inspect status even for non-2xx
    });

    const headers = resp.headers || {};
    const hsts = typeof headers['strict-transport-security'] === 'string';
    // If request succeeded over HTTPS we consider certificate OK (Axios would throw on TLS errors)
    return {
      https: true,
      httpsError: null,
      statusCode: resp.status,
      hsts,
      certificateValid: true
    };
  } catch (err) {
    // Distinguish between network/TLS and plain HTTP fallback
    let errMsg = err && err.message ? err.message : String(err);
    // If axios fell back to HTTP or connection refused - mark accordingly
    return {
      https: false,
      httpsError: errMsg,
      statusCode: null,
      hsts: false,
      certificateValid: false
    };
  }
}

module.exports = checkHttps;
