import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Matches.css';
import {MatchesForGroup} from './Runder.js';
import {SelectBox, participatingRounds} from '../utils.js';
import {showTeamsStatsModalFor} from "../actions/actions";
import LiveDataShown from "../components/liveDataShown";

class Kamper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRound: null,

        };
    };

    changeSelectedRound() {
        this.setState({
            selectedRound: document.getElementsByName('selectBox')[0].value
        })
    };

    changeSelectedRoundDialog() {
        this.setState({
            selectedRoundDialog: document.getElementsByName('selectBoxDialog')[0].value
        })
    };

    lastCupRound() {
        const { currentRound } = this.props;
        let roundNr = currentRound % 2 === 0 ? currentRound : currentRound - 1;
        return roundNr < 4 ? 0 : roundNr === 28 ? 'Playoff' : roundNr >= 30 ? 'Utslagningsrunder' : roundNr;
    }

    render() {
        const { dataz, onShowTeamStatsModal, isCurrentRoundFinished, fplManagersLiveScore, averageScore, currentRound } = this.props;
        let skalBrukeLiveData = !isCurrentRoundFinished && currentRound == this.state.selectedRound;
        return (
            <div className="matches-content">
                {skalBrukeLiveData && <LiveDataShown/>}
                <p style={{'textAlign': 'center', 'fontSize': 'small'}}>(Tips: Du kan trykke på hvert lag for å få opp info om valgt lag pr. runde)</p>
                {SelectBox(participatingRounds, this.changeSelectedRound.bind(this), '', '', this.state.selectedRound || this.lastCupRound())}
                <MatchesForGroup chosenRound={this.state.selectedRound || this.lastCupRound()}
                                 onToggleDialog={onShowTeamStatsModal} dataz={dataz} averageScore={averageScore}
                                 liveScore={skalBrukeLiveData ? fplManagersLiveScore : false}/>
            </div>
        );
    }
}

export const customContentStyle = {
    width: '90%',
    maxWidth: 'none',
    height: '90%',
    maxHeight: 'none',
};

Kamper.propTypes = {
    dataz: PropTypes.object,
    currentRound: PropTypes.number,
    onShowTeamStatsModal: PropTypes.func,
    isCurrentRoundFinished: PropTypes.bool,
    fplManagersLiveScore: PropTypes.object,
    averageScore: PropTypes.number
};

const mapStateToProps = state => ({
    currentRound: state.data.currentRound,
    dataz: state.data.dataz,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
    fplManagersLiveScore: state.liveData.fplManagersLiveScore,
    averageScore: state.liveData.averageScore
});

const mapDispatchToProps = dispatch => ({
    onShowTeamStatsModal: (teamId) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Kamper);
