const { fetchLive } = require('fpl-api');

module.exports = async (req, res) => {
    const { round } = req.query;
    try {
        const values = await fetchLive(round);
        res.json(values);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
