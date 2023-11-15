import LineChart from "../atoms/chart/LineChart";
import { useCallback } from "react";

function HorizontalChartCard({
  id,
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
  loaded,
  additional_information,
  dssim,
  ssim,
  chartStart,
  chartEnd,
}) {
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  return (
    <div style={{ display: "flex", minHeight: 380, maxHeight: "48vh" }}>
      <div
        style={{
          flex: 3,
          backgroundColor: "black",
          minWidth: 380,
          color: "#E6E6E6",
          border: "2px solid #E6E6E6",
          padding: "1.25rem",
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
          {loaded && (
            <>
              {totalTime} <span style={{ fontWeight: 300 }}>SECONDS</span>
            </>
          )}{" "}
          {!loaded && <>Loading...</>}
        </div>
        <div style={{ fontSize: "1.225rem" }}>
          {data?.length?.toLocaleString()} TUPLES
        </div>{" "}
        <div style={{ marginTop: 32 }} />
        {additional_information &&
          Object.entries(additional_information).map(([k, v], i) => (
            <div style={{ fontSize: "1.225rem" }}>
              {k}: {v?.toFixed(3)}
            </div>
          ))}
      </div>
      <div ref={measuredRef} style={{ flex: 7, border: "2px solid #000" }}>
        <LineChart
          id={`${id}`}
          data={data}
          xVariable={xVariable}
          yVariable={yVariable}
          width={width}
          height={height}
          chartStart={chartStart}
          chartEnd={chartEnd}
        />
      </div>
    </div>
  );
}

export default HorizontalChartCard;
