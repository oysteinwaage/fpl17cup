const { fetchEntryEvent, fetchLive, fetchBootstrap, fetchFixtures } = require('fpl-api');

module.exports = async (req, res) => {
    const { entryId, round } = req.query;
    try {
        const [entryEvent, live, bootstrap, fixtures] = await Promise.all([
            fetchEntryEvent(entryId, round),
            fetchLive(round),
            fetchBootstrap(),
            fetchFixtures(round),
        ]);

        const elementsById = {};
        bootstrap.elements.forEach(el => { elementsById[el.id] = el; });
        const teamsById = {};
        bootstrap.teams.forEach(t => { teamsById[t.id] = t; });
        const liveById = {};
        live.elements.forEach(el => { liveById[el.id] = el; });

        // A team's gameweek is only "finished" once all its fixtures this round have concluded.
        const teamFinished = {};
        Object.values(teamsById).forEach(t => {
            const teamFixtures = fixtures.filter(f => f.team_h === t.id || f.team_a === t.id);
            teamFinished[t.id] = teamFixtures.length === 0 || teamFixtures.every(f => f.finished);
        });

        const picks = entryEvent.picks.map(p => ({ ...p }));

        // Resolve captain -> vice-captain fallback multiplier, same idea as getCaptainHistory.js,
        // but only once the captain's fixture has actually finished with 0 minutes played.
        const captainPick = picks.find(p => p.is_captain);
        const vicePick = picks.find(p => p.is_vice_captain);
        if (captainPick) {
            const captainEl = elementsById[captainPick.element] || {};
            const captainLive = (liveById[captainPick.element] || {}).stats;
            const captainConfirmedBlank = teamFinished[captainEl.team] && (!captainLive || captainLive.minutes === 0);
            const baseMultiplier = captainPick.multiplier;
            captainPick.multiplier = captainConfirmedBlank ? 0 : baseMultiplier;
            if (captainConfirmedBlank && vicePick) {
                vicePick.multiplier = baseMultiplier;
            }
        }

        // Apply automatic substitutions: swap pitch position + effective multiplier
        const subInIds = new Set();
        const subOutIds = new Set();
        (entryEvent.automatic_subs || []).forEach(sub => {
            const outPick = picks.find(p => p.element === sub.element_out);
            const inPick = picks.find(p => p.element === sub.element_in);
            if (outPick && inPick) {
                const tmpPos = outPick.position;
                outPick.position = inPick.position;
                inPick.position = tmpPos;
                outPick.multiplier = 0;
                if (inPick.multiplier === 0) inPick.multiplier = 1;
                subOutIds.add(sub.element_out);
                subInIds.add(sub.element_in);
            }
        });

        const enrichedPicks = picks
            .sort((a, b) => a.position - b.position)
            .map(p => {
                const el = elementsById[p.element] || {};
                const team = teamsById[el.team] || {};
                const liveStats = (liveById[p.element] || {}).stats || {};
                return {
                    element: p.element,
                    position: p.position,
                    multiplier: p.multiplier,
                    isCaptain: p.is_captain,
                    isViceCaptain: p.is_vice_captain,
                    isSubIn: subInIds.has(p.element),
                    isSubOut: subOutIds.has(p.element),
                    webName: el.web_name || '',
                    elementType: el.element_type || 0,
                    teamCode: team.code || 0,
                    teamShortName: team.short_name || '',
                    points: liveStats.total_points || 0,
                    minutes: liveStats.minutes || 0,
                    bonus: liveStats.bonus || 0,
                    inDreamteam: liveStats.in_dreamteam || false,
                };
            });

        res.json({
            entryId: Number(entryId),
            round: Number(round),
            activeChip: entryEvent.active_chip,
            entryHistory: entryEvent.entry_history,
            picks: enrichedPicks,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
