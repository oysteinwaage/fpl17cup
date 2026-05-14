const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { entryId } = req.query;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    try {
        const response = await fetch(
            `https://fantasy.premierleague.com/api/entry/${entryId}/`,
            { method: 'GET', headers }
        );

        if (!response.ok) {
            return res.status(404).json({ error: 'Laget ble ikke funnet' });
        }

        const data = await response.json();

        const privateLeagues = [
            ...(data.leagues?.classic || []),
            ...(data.leagues?.h2h || []),
        ]
            .filter(l => l.league_type === 'x')
            .map(l => ({ id: l.id, name: l.name }));

        res.json({
            teamName: data.name,
            managerName: `${data.player_first_name} ${data.player_last_name}`,
            privateLeagues,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
