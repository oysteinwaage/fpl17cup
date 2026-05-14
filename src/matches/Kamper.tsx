import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Matches.css';
import {MatchesForGroup} from './Runder';
import {SelectBox, participatingRounds} from '../utils';
import {showTeamsStatsModalFor} from '../actions/actions';
import LiveDataShown from '../components/liveDataShown';
import { RootState, DataState, LiveDataState } from '../types';

interface KamperProps {
    dataz: DataState['dataz'];
    currentRound: number | null;
    onShowTeamStatsModal: (teamId: number) => void;
    isCurrentRoundFinished: boolean;
    liveData: LiveDataState;
}

interface KamperState {
    selectedRound: number | string | null;
    selectedRoundDialog?: number | string | null;
}

class Kamper extends Component<KamperProps, KamperState> {
    constructor(props: KamperProps) {
        super(props);
        this.state = {
            selectedRound: null,
        };
    }

    changeSelectedRound(): void {
        this.setState({
            selectedRound: document.getElementsByName('selectBox')[0] ? (document.getElementsByName('selectBox')[0] as HTMLSelectElement).value : null
        });
    }

    changeSelectedRoundDialog(): void {
        this.setState<'selectedRoundDialog'>({
            selectedRoundDialog: document.getElementsByName('selectBoxDialog')[0] ? (document.getElementsByName('selectBoxDialog')[0] as HTMLSelectElement).value : null
        });
    }

    lastCupRound(): number | string {
        const {currentRound} = this.props;
        const round = currentRound || 0;
        let roundNr = round % 2 === 0 ? round : round - 1;
        return roundNr < 4 ? 4 : roundNr === 28 ? 'Playoff' : roundNr >= 30 ? 'Utslagningsrunder' : roundNr;
    }

    render() {
        const {dataz, onShowTeamStatsModal, isCurrentRoundFinished, currentRound, liveData} = this.props;
        const lastCupRound = this.lastCupRound();
        // eslint-disable-next-line eqeqeq
        const skalBrukeLiveData = !isCurrentRoundFinished && (this.state.selectedRound === null || currentRound == (this.state.selectedRound as any)) && currentRound === lastCupRound;
        const chosenRound = this.state.selectedRound || lastCupRound;
        const linkRound = (chosenRound as number) < (currentRound || 0) ? chosenRound : currentRound;
        return (
            <div className="matches-content">
                {skalBrukeLiveData && <LiveDataShown/>}
                <p style={{'textAlign': 'center', 'fontSize': 'small'}}>(Nyhet: Du kan trykke på hvert lag for å åpne vedkommendes lag i FPL )</p>
                {SelectBox(participatingRounds, this.changeSelectedRound.bind(this), '', '', chosenRound as number | string)}
                <MatchesForGroup chosenRound={chosenRound as number | string}
                                 onToggleDialog={onShowTeamStatsModal} dataz={dataz}
                                 skalBrukeLiveData={!!skalBrukeLiveData}
                                 liveScore={liveData}
                                 linkRound={linkRound as number | string}/>
            </div>
        );
    }
}

export const customContentStyle: React.CSSProperties = {
    width: '90%',
    maxWidth: 'none',
    height: '90%',
    maxHeight: 'none',
};

const mapStateToProps = (state: RootState) => ({
    currentRound: state.data.currentRound,
    dataz: state.data.dataz,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
    liveData: state.liveData
});

const mapDispatchToProps = (dispatch: any) => ({
    onShowTeamStatsModal: (teamId: number) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Kamper);
