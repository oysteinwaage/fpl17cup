const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { leagueId } = req.query;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    try {
        let allResults = [];
        let page = 1;
        let firstData = null;

        while (true) {
            const response = await fetch(
                `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_standings=${page}`,
                { method: 'GET', headers }
            );
            const data = await response.json();

            if (page === 1) firstData = data;
            allResults = allResults.concat(data.standings.results);

            if (!data.standings.has_next) break;
            page++;
        }

        res.json({
            ...firstData,
            standings: {
                ...firstData.standings,
                results: allResults,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
