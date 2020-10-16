import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import '../App.css';
import './LeagueTable.css';
import {showTeamsStatsModalFor} from "../actions/actions";
import LiveDataShown from "../components/liveDataShown";

function makeRow(rank, teamAndManager, gwPoints, totalPoints, extraClassname = "") {
    return (
        <div key={rank+''+gwPoints} className={"tabellRad" + extraClassname}>
            <div className="tableRank">{rank}</div>
            <div className="tableTeamAndManager">{teamAndManager}</div>
            <div className="tableGwScore">{gwPoints}</div>
            <div className="tableTotalScore">{totalPoints}</div>
        </div>
    )
}

class LeagueTable extends Component {

    render() {
        const { leagueData, onShowTeamStatsModal, isCurrentRoundFinished, liveScore, dataz, currentRound } = this.props;

        return (
            <div key="jallajalla" className="table-content">
                { !isCurrentRoundFinished && <LiveDataShown /> }
                {makeRow('', 'Lag', 'GW', 'TOT', 'Header')}
                {leagueData.standings && leagueData.standings.results.map(team => {
                    const teamAndManager = (
                        <div className="teamName">
                            <a onClick={() => onShowTeamStatsModal(team.entry)}>
                                {team.entry_name}<br/>
                                <div className="managerName">{team.player_name}</div>
                            </a>
                        </div>
                    );
                    const gwPoints = isCurrentRoundFinished ? dataz[team.entry]['round'+ currentRound].points : liveScore[team.entry];
                    const totalPoints = isCurrentRoundFinished ? team.total : dataz[team.entry]['round'+ (currentRound-1)].totalPoints + liveScore[team.entry];
                    return makeRow(
                        team.rank,
                        teamAndManager,
                        gwPoints,
                        totalPoints,
                    );
                })}
            </div>
        );
    }
}


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
