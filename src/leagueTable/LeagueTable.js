import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import '../App.css';
import './LeagueTable.css';
import {showTeamsStatsModalFor} from "../actions/actions";
import LiveDataShown from "../components/liveDataShown";

function makeRow(rank, previousRank, teamAndManager, gwPoints, totalPoints, extraClassname = "") {
    return (
        <div key={rank + '' + gwPoints} className={"tabellRad" + extraClassname}>
            <div className="tableRank">
                {rank}
                {rank > previousRank ? <ArrowDropDownIcon className="redArrow"/> :
                    rank < previousRank ? <ArrowDropUpIcon/> : null}
            </div>
            <div className="tableTeamAndManager">{teamAndManager}</div>
            <div className="tableGwScore">{gwPoints}</div>
            <div className="tableTotalScore">{totalPoints}</div>
        </div>
    )
}

class LeagueTable extends Component {

    render() {
        const {leagueData, onShowTeamStatsModal, isCurrentRoundFinished, liveScore, dataz, currentRound} = this.props;

        const leagueDataSorted = leagueData.standings && leagueData.standings.results.reduce((acc, team) => {
            const gwPoints = isCurrentRoundFinished ? dataz[team.entry]['round' + currentRound].points : liveScore[team.entry].totalPoints;
            const totalPoints = isCurrentRoundFinished ? team.total : dataz[team.entry]['round' + (currentRound - 1)].totalPoints + liveScore[team.entry].totalPoints;
            acc.push({
                entry: team.entry,
                entry_name: team.entry_name,
                player_name: team.player_name,
                previous_rank: team.last_rank || team.rank,
                gwPoints,
                totalPoints
            });
            return acc;
        }, []).sort(function (a, b) {
            return b.totalPoints - a.totalPoints;
        });

        return (
            <div key="jallajalla" className="table-content">
                {!isCurrentRoundFinished && <LiveDataShown/>}
                {makeRow('', '', 'Lag', 'GW', 'TOT', 'Header')}
                {(leagueDataSorted || []).map((team, index) => {
                    const teamAndManager = (
                        <div className="teamName">
                            <a onClick={() => onShowTeamStatsModal(team.entry)}>
                                {team.entry_name}<br/>
                                <div className="managerName">{team.player_name}</div>
                            </a>
                        </div>
                    );
                    return makeRow(
                        index + 1,
                        team.previous_rank,
                        teamAndManager,
                        team.gwPoints,
                        team.totalPoints,
                    );
                })}
            </div>
        );
    }
}

// TODO kan nok slettes, men tar bare var på for sikkerhets skyld om noe går skeis når runden ikke er på Live-modus lenger.
// return (
//     <div key="jallajalla" className="table-content">
//         {!isCurrentRoundFinished && <LiveDataShown/>}
//         {makeRow('', 'Lag', 'GW', 'TOT', 'Header')}
//         {leagueData.standings && leagueData.standings.results.map(team => {
//             const teamAndManager = (
//                 <div className="teamName">
//                     <a onClick={() => onShowTeamStatsModal(team.entry)}>
//                         {team.entry_name}<br/>
//                         <div className="managerName">{team.player_name}</div>
//                     </a>
//                 </div>
//             );
//             const gwPoints = isCurrentRoundFinished ? dataz[team.entry]['round' + currentRound].points : liveScore[team.entry];
//             const totalPoints = isCurrentRoundFinished ? team.total : dataz[team.entry]['round' + (currentRound - 1)].totalPoints + liveScore[team.entry];
//             return makeRow(
//                 team.rank,
//                 teamAndManager,
//                 gwPoints,
//                 totalPoints,
//             );
//         }).sort(function (a, b) {
//             return b.props.children[3].props.children - a.props.children[3].props.children;
//         })
//         }
//     </div>
// );

LeagueTable.propTypes = {
    currentRound: PropTypes.number,
    dataz: PropTypes.object,
    leagueData: PropTypes.object,
    onShowTeamStatsModal: PropTypes.func,
    liveScore: PropTypes.object,
    isCurrentRoundFinished: PropTypes.bool
};

const mapStateToProps = state => ({
    currentRound: state.data.currentRound,
    dataz: state.data.dataz,
    leagueData: state.data.leagueData,
    liveScore: state.liveData.fplManagersLiveScore,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
});

const mapDispatchToProps = dispatch => ({
    onShowTeamStatsModal: (teamId) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeagueTable);
