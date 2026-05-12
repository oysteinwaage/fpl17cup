const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { leagueId } = req.query;
    try {
        const response = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
