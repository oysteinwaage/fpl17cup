const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const teams = req.query.teams.split(',');
    try {
        const data = await Promise.all(
            teams.map(teamId =>
                fetch(`https://fantasy.premierleague.com/api/entry/${teamId}/transfers/`, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }).then(r => r.json())
            )
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
