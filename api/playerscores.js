const { fetchElementSummary } = require('fpl-api');

module.exports = async (req, res) => {
    const players = req.query.players.split(',');
    const results = await Promise.allSettled(players.map(fetchElementSummary));
    const playerScores = results.reduce((prev, result) => {
        if (result.status === 'fulfilled') {
            prev[result.value.id] = result.value.history;
        }
        return prev;
    }, {});
    if (Object.keys(playerScores).length === 0 && players.length > 0) {
        res.status(500).json({ error: results[0].reason?.message || 'Kunne ikke hente spillerpoeng' });
        return;
    }
    res.json(playerScores);
};
