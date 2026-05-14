import React, {Component} from 'react';
import {connect} from 'react-redux';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import '../App.css';
import './LeagueTable.css';
import {showTeamsStatsModalFor} from '../actions/actions';
import LiveDataShown from '../components/liveDataShown';
import { RootState, DataState, LiveDataState, LeagueData } from '../types';

function makeRow(
    rank: number | string,
    previousRank: number | string,
    teamAndManager: React.ReactNode,
    gwPoints: number | string,
    totalPoints: number | string,
    extraClassname: string = ""
): React.ReactElement {
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
    );
}

interface LeagueTableProps {
    currentRound: number | null;
    dataz: DataState['dataz'];
    leagueData: LeagueData;
    onShowTeamStatsModal: (teamId: number) => void;
    liveScore: LiveDataState['fplManagersLiveScore'];
    isCurrentRoundFinished: boolean;
}

class LeagueTable extends Component<LeagueTableProps, {}> {

    render() {
        const {leagueData, onShowTeamStatsModal, isCurrentRoundFinished, liveScore, dataz, currentRound} = this.props;

        const leagueDataSorted = leagueData.standings && leagueData.standings.results.reduce((acc: any[], team: any) => {
            const liveEntry = liveScore && liveScore[team.entry];
            const gwPoints = isCurrentRoundFinished ? dataz[team.entry]['round' + currentRound].points : (liveEntry ? liveEntry.totalPoints : 0);
            const totalPoints = isCurrentRoundFinished ? team.total : (currentRound! > 1 ? dataz[team.entry]['round' + (currentRound! - 1)].totalPoints : 0) + (liveEntry ? liveEntry.totalPoints : 0);
            acc.push({
                entry: team.entry,
                entry_name: team.entry_name,
                player_name: team.player_name,
                previous_rank: team.last_rank || team.rank,
                gwPoints,
                totalPoints
            });
            return acc;
        }, []).sort(function (a: any, b: any) {
            return b.totalPoints - a.totalPoints;
        });

        return (
            <div key="jallajalla" className="table-content">
                {!isCurrentRoundFinished &&
                <>
                    <LiveDataShown/>
                    <p style={{'textAlign': 'center', 'fontSize': 'small'}}>(Gameweek og Total score presenteres her med
                        eventuelle hits allerede trukket fra!)</p>
                </>
                }
                {makeRow('', '', 'Lag', 'GW', 'TOT', 'Header')}
                {(leagueDataSorted || []).map((team: any, index: number) => {
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

const mapStateToProps = (state: RootState) => ({
    currentRound: state.data.currentRound,
    dataz: state.data.dataz,
    leagueData: state.data.leagueData,
    liveScore: state.liveData.fplManagersLiveScore,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
});

const mapDispatchToProps = (dispatch: any) => ({
    onShowTeamStatsModal: (teamId: number) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeagueTable);
