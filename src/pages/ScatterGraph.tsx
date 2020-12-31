import { CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import React from 'react';
import { useGetGraphDataFromRawData } from "../common/api";
import {Typography} from "antd";

function ScatterGraph() {
  const search = window.location.search;
  const playlistId = search.match(/playlistId=(.*)/)![1];
  const playlistName = search.match(/playlistName=(.*)&/)![1];

  // Get the graph data from raw data
  const [graphData, setGraphData] = useGetGraphDataFromRawData(playlistId);

  console.log(graphData);

  return (
    <div className="pageRoot">
      <div className="graphContainer">
        <Typography.Title className="playlistTitle">{`Playlist analysis for ${playlistName}`}</Typography.Title>
        <ScatterChart width={730} height={250}
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
          <XAxis dataKey="danceability" name="danceability" unit="cm" />
          <YAxis dataKey="energy" name="energy" unit="kg" />
          <ZAxis dataKey="loudness" range={[0, 200]} name="valence" unit="km" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Scatter name="A school" data={graphData} fill="#8884d8" />
          {/* <Scatter name="B school" data={data02} fill="#82ca9d" /> */}
        </ScatterChart>
      </div>
    </div>
  );
}

export default ScatterGraph;
