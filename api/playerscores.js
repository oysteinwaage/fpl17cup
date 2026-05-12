const { fetchElementSummary } = require('fpl-api');

module.exports = async (req, res) => {
    const players = req.query.players.split(',');
    try {
        const values = await Promise.all(players.map(fetchElementSummary));
        const playerScores = values.reduce((prev, curr) => {
            prev[curr.id] = curr.history;
            return prev;
        }, {});
        res.json(playerScores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
