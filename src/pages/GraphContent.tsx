import React from 'react';
import {ChartTypes} from '../constants/types';
import BarGraph from '../pages/BarGraph';
import ScatterGraph from '../pages/ScatterGraph';
import './GraphContent.css';

function GraphContent({chartType}: {chartType: ChartTypes}) {

  const renderGraph = (chartType: ChartTypes) => {
    switch(chartType) {
      case ChartTypes.BarGraph:
        return <BarGraph/>
      case ChartTypes.ScatterGraph:
        return <ScatterGraph/>
    }
  }

  return (
    <div className="graphContentRoot">
      {renderGraph(chartType)}
    </div>
  );
}

export default GraphContent;
