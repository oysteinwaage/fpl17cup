const fetch = require('node-fetch');

const MAX_PARTICIPANTS = 150;

module.exports = async (req, res) => {
    const { leagueId } = req.query;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    try {
        const firstResponse = await fetch(
            `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_standings=1`,
            { method: 'GET', headers }
        );
        const firstData = await firstResponse.json();

        let allResults = [...firstData.standings.results];
        let truncated = false;
        let hasNext = firstData.standings.has_next;

        if (allResults.length >= MAX_PARTICIPANTS) {
            allResults = allResults.slice(0, MAX_PARTICIPANTS);
            truncated = true;
        } else {
            let page = 2;
            while (hasNext) {
                const response = await fetch(
                    `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_standings=${page}`,
                    { method: 'GET', headers }
                );
                const data = await response.json();
                allResults = allResults.concat(data.standings.results);

                if (allResults.length >= MAX_PARTICIPANTS) {
                    allResults = allResults.slice(0, MAX_PARTICIPANTS);
                    truncated = true;
                    break;
                }

                hasNext = data.standings.has_next;
                page++;
            }
        }

        res.json({
            ...firstData,
            truncated,
            standings: {
                ...firstData.standings,
                results: allResults,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
