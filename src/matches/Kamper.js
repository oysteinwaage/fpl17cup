import React, {Component} from 'react';
import {connect} from 'react-redux';
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
        const {currentRound} = this.props;
        let roundNr = currentRound % 2 === 0 ? currentRound : currentRound - 1;
        return roundNr < 4 ? 4 : roundNr === 28 ? 'Playoff' : roundNr >= 30 ? 'Utslagningsrunder' : roundNr;
    }

    render() {
        const {dataz, onShowTeamStatsModal, isCurrentRoundFinished, currentRound, liveData} = this.props;
        let skalBrukeLiveData = !isCurrentRoundFinished && (this.state.selectedRound === null || currentRound == this.state.selectedRound) && currentRound === this.lastCupRound();
        const chosenRound = this.state.selectedRound || this.lastCupRound();
        // TODO denne må fikses før vi kommer til utslagningsrunder da lastCupRound ikke lenger er et tall
        const linkRound = chosenRound < currentRound ? chosenRound : currentRound;
        return (
            <div className="matches-content">
                {skalBrukeLiveData && <LiveDataShown/>}
                <p style={{'textAlign': 'center', 'fontSize': 'small'}}>(Nyhet: Du kan trykke på hvert lag for å åpne vedkommendes lag i FPL )</p>
                {SelectBox(participatingRounds, this.changeSelectedRound.bind(this), '', '', chosenRound)}
                <MatchesForGroup chosenRound={chosenRound}
                                 onToggleDialog={onShowTeamStatsModal} dataz={dataz}
                                 skalBrukeLiveData={skalBrukeLiveData}
                                 liveScore={liveData}
                                 linkRound={linkRound}/>
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
    liveData: PropTypes.object
};

const mapStateToProps = state => ({
    currentRound: state.data.currentRound,
    dataz: state.data.dataz,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
    liveData: state.liveData
});

const mapDispatchToProps = dispatch => ({
    onShowTeamStatsModal: (teamId) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Kamper);
