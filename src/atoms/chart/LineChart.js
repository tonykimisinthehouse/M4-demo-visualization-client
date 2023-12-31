// Code referenced https://github.com/mikec3/my_tutorials/blob/master/d3_react_examples/src/LineChart.js
import * as d3 from "d3";
import { useEffect } from "react";

function LineChart({
  id,
  width,
  height,
  data = [],
  xVariable,
  yVariable,
  chartStart,
  chartEnd,
}) {
  const yMinValue = d3.min(data, (d) => d?.[yVariable]);
  const yMaxValue = d3.max(data, (d) => d?.[yVariable]);

  const xScale = d3
    .scaleLinear()
    .domain([chartStart, chartEnd])
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
    <div style={{ width: width, height: height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className={`${id}_svg`}>
        <path
          d={d}
          fill="None"
          stroke="#111"
          strokeWidth={"1.5"}
          id={`${id}_path`}
        />
      </svg>
    </div>
  );
}

export default LineChart;
