import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import '../App.css';
import './LeagueTable.css';
import {showTeamsStatsModalFor} from "../actions/actions";

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
        const { leagueData, onShowTeamStatsModal } = this.props;

        return (
            <div key="jallajalla" className="table-content">
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
                    return makeRow(
                        team.rank,
                        teamAndManager,
                        team.event_total,
                        team.total,
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
    onShowTeamStatsModal: PropTypes.func
};

const mapStateToProps = state => ({
    currentRound: state.data.currentRound,
    dataz: state.data.dataz,
    leagueData: state.data.leagueData
});

const mapDispatchToProps = dispatch => ({
    onShowTeamStatsModal: (teamId) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeagueTable);
