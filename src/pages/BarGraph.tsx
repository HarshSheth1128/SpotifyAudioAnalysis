import React, {useCallback, useEffect, useState} from 'react';
import { BarChart, Legend, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';
import CustomizedAxisTick from '../components/CustomizedTick';
import { Typography, Checkbox, Radio, Pagination} from 'antd';
import { useGetGraphDataFromRawData } from '../common/api';
import { GraphData } from '../constants/types';
import "./BarGraph.css";

enum RadioSortByOptions {
  none = 'none',
  danceability = 'danceability',
  energy = 'energy',
  valence = 'valence',
  tempo = 'tempo',
  loudness = 'loudness',
}

enum SortOrder {
  ascending = 'ascending',
  descending = 'descending',
}

export function BarGraph() {
  const search = window.location.search;
  const playlistId = search.match(/playlistId=(.*)/)![1];
  const [activeFeatures, setActiveFeatures] = useState({
    danceability: true,
    energy: false,
    valence: false,
    tempo: false,
    loudness: false
  })
  const [sortBy, setSortBy] = useState<RadioSortByOptions>(RadioSortByOptions.none);
  
  
  const [paginatedData, setPaginatedData] = useState<GraphData[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 30;
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.descending);

  const sortData = useCallback((graphData: GraphData[]): GraphData[] => {
    if (sortBy === RadioSortByOptions.none) return graphData;

    if (sortOrder === SortOrder.descending) {
      return graphData.sort((a, b) => a[sortBy]! - b[sortBy]!);
    } else {
      return graphData.sort((a, b) => b[sortBy]! - a[sortBy]!);
    }
    
  }, [sortBy, sortOrder]);

  const paginateData = useCallback((graphData: GraphData[]): GraphData[] => {
    return graphData.slice(
      (page - 1) * 30,
      ((page - 1) * 30) + 30
    );
  }, [page]);

  // Get the graph data from raw data
  const [graphData, setGraphData] = useGetGraphDataFromRawData(playlistId);
 
  // Sort and paginate data on radio change
  useEffect(() => {
    const sortedData = sortData(graphData);
    setGraphData(sortedData);
    setPaginatedData(paginateData(sortedData));
  }, [sortBy, sortOrder, graphData, sortData, paginateData, setGraphData]);


  return (
    <div className="pageRootBar">
      <div className="graphContainerBar">
        <div className="barGraph">
          <BarChart barCategoryGap={'15%'} layout="vertical" width={730} height={1100} data={paginatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            {/* @ts-expect-error */}
            <YAxis tick={<CustomizedAxisTick/>}type="category" width={100} interval={0} dataKey="name" />
            <Tooltip />
            <Legend />
            {activeFeatures.danceability && <Bar dataKey="danceability" fill="#8884d8" />}
            {activeFeatures.energy && <Bar dataKey="energy" fill="#84d89d" />}
            {activeFeatures.valence && <Bar dataKey="valence" fill="#bd84d8" />}
            {activeFeatures.tempo && <Bar dataKey="tempo" fill="#d88492" />}
            {activeFeatures.loudness && <Bar dataKey="loudness" fill="#d8d284" />}
          </BarChart>
        </div>

        <div className="paginateContainer">
          <Typography.Text style={{fontSize: '1rem', fontWeight: 'bold'}}>Pagination</Typography.Text>
          <Pagination simple onChange={(page) => setPage(page)} current={page} pageSize={itemsPerPage} total={graphData.length} />
        </div>
      </div>
      <div className="settingsContainerBar">
        <div className="checkboxContainer">
          <Typography.Text style={{fontSize: '1rem', fontWeight: 'bold'}}>Features</Typography.Text>
          <div><Checkbox checked={activeFeatures.danceability} onChange={() => toggleFeature('danceability')}/><span className="graphCheckboxText">Danceability</span></div>
          <div><Checkbox checked={activeFeatures.energy} onChange={() => toggleFeature('energy')}/><span className="graphCheckboxText">Energy</span></div>
          <div><Checkbox checked={activeFeatures.valence} onChange={() => toggleFeature('valence')}/><span className="graphCheckboxText">Valence</span></div>
          <div><Checkbox checked={activeFeatures.tempo} onChange={() => toggleFeature('tempo')}/><span className="graphCheckboxText">Tempo</span></div>
          <div><Checkbox checked={activeFeatures.loudness} onChange={() => toggleFeature('loudness')}/><span className="graphCheckboxText">Loudness</span></div>
        </div>
        <div className="sortContainer">
          <Typography.Text style={{fontSize: '1rem', fontWeight: 'bold'}}>Sort By</Typography.Text>
          <Radio.Group value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <Radio value={RadioSortByOptions.none} ><span className="graphCheckboxText">None</span></Radio>
            <Radio value={RadioSortByOptions.danceability} disabled={!activeFeatures.danceability}><span className="graphCheckboxText">Danceability</span></Radio>
            <Radio value={RadioSortByOptions.energy} disabled={!activeFeatures.energy}><span className="graphCheckboxText">Energy</span></Radio>
            <Radio value={RadioSortByOptions.valence} disabled={!activeFeatures.valence}><span className="graphCheckboxText">Valence</span></Radio>
            <Radio value={RadioSortByOptions.tempo} disabled={!activeFeatures.tempo}><span className="graphCheckboxText">Tempo</span></Radio>
            <Radio value={RadioSortByOptions.loudness} disabled={!activeFeatures.loudness}><span className="graphCheckboxText">Loudness</span></Radio>
          </Radio.Group>
        </div>

        <div className="sortContainer">
          <Typography.Text style={{fontSize: '1rem', fontWeight: 'bold'}}>Sort Order</Typography.Text>
          <Radio.Group value={sortOrder} onChange={(e)=> setSortOrder(e.target.value)} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <Radio value={SortOrder.ascending} disabled={sortBy === RadioSortByOptions.none} ><span className="graphCheckboxText">Ascending</span></Radio>
            <Radio value={SortOrder.descending} disabled={sortBy === RadioSortByOptions.none} ><span className="graphCheckboxText">Descending</span></Radio>
          </Radio.Group>
        </div>

      </div>
      
    </div>
  );

 function toggleFeature(feature: "danceability" | "energy" | "valence" | "tempo" | "loudness") {
  setActiveFeatures({...activeFeatures, [feature]: !activeFeatures[feature]})
 }
}

export default BarGraph;
