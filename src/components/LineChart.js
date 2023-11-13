// Code referenced https://github.com/mikec3/my_tutorials/blob/master/d3_react_examples/src/LineChart.js
import * as d3 from "d3";
import { useEffect } from "react";

function LineChart({ width, height, data = [], xVariable, yVariable }) {

  const yMinValue = d3.min(data, (d) => d?.[yVariable]);
  const yMaxValue = d3.max(data, (d) => d?.[yVariable]);
  const xMinValue = d3.min(data, (d) => d?.[xVariable]);
  const xMaxValue = d3.max(data, (d) => d?.[xVariable]);

  const xScale = d3
    .scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, width]);

  // create scale for y axis
  const yScale = d3
    .scaleLinear()
    .domain([yMinValue, yMaxValue])
    .range([height, 0]);

  let line = d3
    .line()
    .x((d) => xScale(d[xVariable]))
    .y((d) => yScale(d[yVariable]));
  let d = line(data);

  return (
    <div style={{width: width, height: height}}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
      >
        <path
          d={d}
          fill="None"
          stroke="#111"
          strokeWidth={"1.5"}
        />

      </svg>
    </div>
  );
}

export default LineChart;
