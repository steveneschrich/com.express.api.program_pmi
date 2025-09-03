const express = require('express');
const axios = require('axios');
const router = express.Router();

// Proxy GET /api/idconv?id=... to NCBI
router.get('/', async (req, res) => {
    try {
        const ncbiUrl = 'https://pmc.ncbi.nlm.nih.gov/tools/idconv/api/v1/articles';

        // Get ID from query params
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID parameter is required' });
        }

        // Build NCBI request with server-side credentials
        const tool = process.env.NCBI_TOOL_NAME || 'program_pmi';
        const email = process.env.NCBI_USER_EMAIL || 'app@example.com';

        const ncbiParams = {
            tool,
            email,
            versions: 'no',
            format: 'json',
            ids: id
        };

        console.log('Calling NCBI with params:', ncbiParams);

        const response = await axios.get(ncbiUrl, {
            params: ncbiParams,
            responseType: 'json',
            timeout: 10000
        });

        // Forward response body and status
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('NCBI idconv proxy error:', err.message || err);

        // If upstream responded with content, forward status/data when possible
        if (err.response && err.response.data) {
            return res.status(err.response.status || 502).json(err.response.data);
        }

        res.status(502).json({ error: 'Upstream fetch failed' });
    }
});

module.exports = router;