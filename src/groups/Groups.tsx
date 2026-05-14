import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../App.css';
import './Groups.css';
import {groups} from '../matches/Runder';
import {participatingRounds} from '../utils';
import LiveDataShown from '../components/liveDataShown';
import { RootState, GroupData } from '../types';

const groupsMembers: Record<string, number[]> = {
    groupA: [2119845, 1538696, 190505, 493208, 4967979, 3605267],
    groupB: [828403, 1166619, 455789, 3476572, 1033331, 1],
    groupC: [2512093, 2, 381029, 5375037, 143741, 3434339],
    groupD: [5142137, 3199103, 775134, 3986698, 2690935, 0],
};

function makeRow(
    team: string | number,
    matches: number | string | undefined,
    wins: number | string | undefined,
    draws: number | string | undefined,
    lost: number | string | undefined,
    goalDiff: string | number | undefined,
    points: number | string | undefined,
    extraClassname: string = ""
): React.ReactElement {
    return (
        <div key={team} className={"gruppeRad" + extraClassname}>
            <div className="groupTeam">{team}</div>
            <div className="groupMatches">{matches}</div>
            <div className="groupMatches">{wins}</div>
            <div className="groupMatches">{draws}</div>
            <div className="groupMatches">{lost}</div>
            <div className="groupGoalDiff">{goalDiff}</div>
            <div className="groupPoints">{points}</div>
        </div>
    );
}

interface GrupperProps {
    groupData: Record<string | number, GroupData>;
    players: Record<number, string>;
    currentRound: number | null;
    isCurrentRoundFinished: boolean;
}

class Grupper extends Component<GrupperProps, {}> {
    tempNullCheck = (teamId: number): GroupData => this.props.groupData[teamId] || {};

    render() {
        const {players, currentRound, isCurrentRoundFinished} = this.props;
        const that = this;
        return (
            <div className="group-content">
                {!isCurrentRoundFinished && participatingRounds.includes(currentRound as number) && <LiveDataShown/>}
                {groups.map(function (groupLetter) {
                    const groupId = 'group' + groupLetter;
                    const sortedGroupMembers = [...groupsMembers[groupId]].sort(function (a, b) {
                        return (that.tempNullCheck(b).difference || 0) - (that.tempNullCheck(a).difference || 0);
                    }).sort(function (a, b) {
                        return (that.tempNullCheck(b).points || 0) - (that.tempNullCheck(a).points || 0);
                    });
                    return (<div key={groupId}>
                        <div className='groupName'>{'Gruppe ' + groupLetter}</div>
                        {makeRow('Lag', 'K', 'S', 'U', 'T', 'Diff', 'Poeng', 'Header')}
                        {sortedGroupMembers.map(team => {
                            const teamData = that.tempNullCheck(team);
                            const diff = (teamData.difference || 0) > 0 ? '+' + teamData.difference : teamData.difference;
                            return makeRow(
                                team < 4 ? "Fantasy Average" : players[team],
                                teamData.matches,
                                teamData.matchesWon,
                                teamData.matchesDrawn,
                                teamData.matchesLost,
                                diff,
                                teamData.points
                            );
                        })}
                    </div>);
                })}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    groupData: state.data.groupData,
    players: state.data.players,
    currentRound: state.data.currentRound,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished
});

export default connect(mapStateToProps)(Grupper);
