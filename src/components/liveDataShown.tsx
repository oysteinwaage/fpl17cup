import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '@/types';

interface LiveDataShownProps {
  text?: string;
  lastUpdated: number | null;
}

class LiveDataShown extends Component<LiveDataShownProps, {}> {
  render() {
    const { text, lastUpdated } = this.props;
    return (
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-500 rounded-full px-3 py-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Live</span>
        </div>
        {lastUpdated != null && (
          <span className="text-xs text-gray-500">
            Sist oppdatert {new Date(lastUpdated).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
        {text && (
          <span className="text-xs text-gray-500 italic">{text}</span>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  lastUpdated: state.liveData.lastUpdated,
});

export default connect(mapStateToProps)(LiveDataShown);
