const { fetchEntry, fetchEntryHistory } = require('fpl-api');

module.exports = async (req, res) => {
    const teams = req.query.teams.split(',');
    try {
        const data = await Promise.all(
            teams.map(teamId =>
                fetchEntry(teamId).then(entry =>
                    fetchEntryHistory(teamId).then(history => ({ ...history, entry }))
                )
            )
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
