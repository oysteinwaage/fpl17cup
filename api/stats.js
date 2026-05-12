const { fetchBootstrap } = require('fpl-api');

module.exports = async (req, res) => {
    try {
        const values = await fetchBootstrap();
        let currentRound = 0;
        let stats = {};

        values.events.forEach(round => {
            if (round.is_current) currentRound = round.id;
            Object.assign(stats, {
                [round.id]: {
                    average_entry_score: round.average_entry_score,
                    chip_plays: round.chip_plays,
                    highest_score: round.highest_score,
                    top_element_info: round.top_element_info,
                    most_captained: round.most_captained,
                    most_vice_captained: round.most_vice_captained,
                    most_transferred_in: round.most_transferred_in,
                    is_current: round.is_current,
                    finished: round.finished,
                },
            });
        });

        let allPlayers = {};
        values.elements.forEach(player => {
            allPlayers[player.id] = {
                first_name: player.first_name,
                second_name: player.second_name,
                web_name: player.web_name,
                selected_by_percent: player.selected_by_percent,
                form: player.form,
                transfers_in_event: player.transfers_in_event,
                transfers_out_event: player.transfers_out_event,
                total_points: player.total_points,
                in_dreamteam: player.in_dreamteam,
            };
        });

        res.json({ ...stats, allPlayers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
