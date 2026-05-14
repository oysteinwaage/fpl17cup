import React, { Component } from 'react';

interface LiveDataShownProps {
  text?: string;
}

class LiveDataShown extends Component<LiveDataShownProps, {}> {
  render() {
    return (
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-500 rounded-full px-3 py-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Live</span>
        </div>
        {this.props.text && (
          <span className="text-xs text-gray-500 italic">{this.props.text}</span>
        )}
      </div>
    );
  }
}

export default LiveDataShown;
