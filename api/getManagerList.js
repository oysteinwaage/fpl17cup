const { fetchClassicLeague } = require('fpl-api');

module.exports = async (req, res) => {
    const { leagueId } = req.query;
    try {
        const values = await fetchClassicLeague(leagueId);
        const playerIds = values.map(p => p.entry);
        res.json(playerIds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
