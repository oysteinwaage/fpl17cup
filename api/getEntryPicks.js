const { fetchEntryEvent } = require('fpl-api');

module.exports = async (req, res) => {
    const { round } = req.query;
    const teams = req.query.teams.split(',');
    try {
        const values = await Promise.all(
            teams.map(teamId =>
                fetchEntryEvent(teamId, round).then(data => ({ ...data, entryId: teamId }))
            )
        );
        res.json(values);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
