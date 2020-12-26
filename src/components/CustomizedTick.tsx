import React from 'react';
import { JsxElement } from 'typescript';
import './CustomizedTick.css';

function CustomizedAxisTick(props: {x: number, y: number, stroke: string, payload: {value: JsxElement}}) {
  const {x, y, payload} = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text className="graphText" x={0} y={0} dy={3} textAnchor="end" transform="rotate(10)" opacity="0.85" fill="#ffffff">{payload.value}</text>
    </g>
  );
}

export default CustomizedAxisTick;
