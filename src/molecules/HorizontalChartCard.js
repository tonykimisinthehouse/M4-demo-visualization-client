import LineChart from "../atoms/chart/LineChart";
import { useCallback } from "react";

function HorizontalChartCard({
  datasetName,
  dataReductionMethod,
  totalTime,

  data,
  xVariable,
  yVariable,
  height,
  setHeight,
  width,
  setWidth,
}) {
  const id = dataReductionMethod.replace(/ /g, "_");

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  return (
    <div style={{ display: "flex", minHeight: 540, maxHeight: "48vh" }}>
      <div
        style={{
          flex: 3,
          backgroundColor: "black",
          minWidth: 380,
          color: "#E6E6E6",
          border: "2px solid #E6E6E6",
          // display: "flex",
          // flexDirection: "column",
          // alignContent: "center",
        }}
      >
        <div style={{ fontSize: "1.25rem" }}>{datasetName}</div>
        <div style={{ fontWeight: 700, fontSize: "2.5rem" }}>
          {dataReductionMethod}
        </div>
        <div
          style={{ fontWeight: 500, fontSize: "2.5rem", alignContent: "end" }}
        >
          {totalTime} <span style={{ fontWeight: 300 }}>SECONDS</span>
        </div>
        <div style={{ fontSize: "1.225rem" }}>
          {data?.length?.toLocaleString()} TUPLES
        </div>
      </div>
      <div ref={measuredRef} style={{ flex: 7, border: "2px solid #000" }}>
        <LineChart
          svg_class={`${id}_svg`}
          data={data}
          xVariable={xVariable}
          yVariable={yVariable}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}

export default HorizontalChartCard;
