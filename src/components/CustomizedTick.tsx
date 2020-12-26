import React from 'react';
import { JsxElement } from 'typescript';

function CustomizedAxisTick(props: {x: number, y: number, stroke: string, payload: {value: JsxElement}}) {
  const {x, y, payload} = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(10)">{payload.value}</text>
    </g>
  );
}

export default CustomizedAxisTick;
