const { fetchEntryEvent, fetchLive } = require('fpl-api');

module.exports = async (req, res) => {
    const teams = req.query.teams.split(',').map(Number);
    const rounds = req.query.rounds.split(',').map(Number);
    try {
        // Fetch live scores for all rounds first
        const liveByRound = {};
        await Promise.all(
            rounds.map(round =>
                fetchLive(round).then(data => {
                    const points = {};
                    data.elements.forEach(el => {
                        points[el.id] = { points: el.stats.total_points, minutes: el.stats.minutes };
                    });
                    liveByRound[round] = points;
                }).catch(() => { liveByRound[round] = {}; })
            )
        );

        const results = await Promise.all(
            teams.flatMap(teamId =>
                rounds.map(round =>
                    fetchEntryEvent(teamId, round)
                        .then(data => {
                            const captainPick = data.picks.find(p => p.is_captain);
                            const vicePick = data.picks.find(p => p.is_vice_captain);
                            const captainId = captainPick ? captainPick.element : null;
                            const viceId = vicePick ? vicePick.element : null;
                            const multiplier = Math.max(
                                captainPick ? captainPick.multiplier : 2,
                                vicePick ? vicePick.multiplier : 1
                            );

                            let captainPoints = null;
                            const live = liveByRound[round] || {};
                            if (captainId) {
                                const captainLive = live[captainId];
                                const viceLive = live[viceId];
                                const captainPlayed = captainLive && captainLive.minutes > 0;
                                const activePoints = captainPlayed
                                    ? captainLive.points
                                    : (viceLive ? viceLive.points : 0);
                                captainPoints = activePoints * multiplier;
                            }

                            return {
                                teamId,
                                round,
                                captain: captainId,
                                vice: viceId,
                                multiplier,
                                multiplierVice: vicePick ? vicePick.multiplier : null,
                                captainPoints,
                            };
                        })
                        .catch(() => ({ teamId, round, captain: null, captainPoints: null }))
                )
            )
        );
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
