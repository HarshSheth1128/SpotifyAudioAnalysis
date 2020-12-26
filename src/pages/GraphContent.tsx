import React from 'react';
import {ChartTypes} from '../constants/types';
import BarGraph from '../pages/BarGraph';
import './GraphContent.css';

function GraphContent({setChartType, chartType}: {setChartType: React.Dispatch<React.SetStateAction<ChartTypes>>, chartType: ChartTypes;}) {

  const renderGraph = (chartType: ChartTypes) => {
    switch(chartType) {
      case ChartTypes.BarGraph:
        return <BarGraph/>
    }
  }

  return (
    <div className="graphContentRoot">
      {renderGraph(chartType)}
    </div>
  );
}

export default GraphContent;
