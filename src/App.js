import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import toImg from "react-svg-to-image";

import "./App.css";
import { useEffect, useState } from "react";
import HorizontalChartCard from "./molecules/HorizontalChartCard";

// const backend_url = "http://localhost:8000";
// const backend_url = "http://18.222.117.210:8000";
const backend_url = "http://3.138.181.40:8000";

function App() {
  // const [fromTime, setFromTime] = useState(1698638400);
  // const [toTime, setToTime] = useState(1698677288);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const [aggregationResponseTime, setAggregationResponseTime] = useState(0);
  const [rawResponseTime, setRawResponseTime] = useState(0);
  const [value, onChange] = useState([
    new Date(1698638400 * 1000),
    new Date(1698724800 * 1000),
  ]);

  const saveChart = () => {
    toImg(`.M4_Aggregation_svg`, `sample-M4_Aggregation`, {
      scale: 1,
      format: "jpg",
      quality: 1,
      download: true,
    }).then((fileData) => {
      //do something with the data
    });
    toImg(`.Raw_Data_svg`, `sample-Raw_Data`, {
      scale: 1,
      format: "jpg",
      quality: 1,
      download: true,
    }).then((fileData) => {
      //do something with the data
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (width > 0) {
        try {
          let start_time = Date.now();
          const response = await fetch(
            `${backend_url}/get_time_series?from_time=${Math.round(
              value[0].getTime() / 1000
            )}&to_time=${Math.round(
              value[1].getTime() / 1000
            )}&chart_width=${Math.ceil(width)}&chart_height=${Math.ceil(
              height
            )}`
          );
          const jsonData = await response.json();
          // console.log(jsonData.map((x) => ({ value: x[0], label: x[1] })));
          const secSpent = (Date.now() - start_time) / 1000;
          console.log(secSpent);
          setAggregationResponseTime(secSpent);
          setData(jsonData?.map((x) => ({ x: x[0], y: x[1] })));
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
  }, [value, width, height]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let start_time = Date.now();

        const response = await fetch(
          `${backend_url}/get_raw_time_series?from_time=${Math.round(
            value[0].getTime() / 1000
          )}&to_time=${Math.round(value[1].getTime() / 1000)}`
        );
        const secSpent = (Date.now() - start_time) / 1000;
        setRawResponseTime(secSpent);
        const jsonData = await response.json();
        // console.log(jsonData.map((x) => ({ value: x[0], label: x[1] })));
        setRawData(jsonData.map((x) => ({ x: x[0], y: x[1] })));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [value]);

  return (
    <div
    // style={{ display: "flex", maxHeight: "100%", boxSizing: "border-box" }}
    >
      {/*<div style={{ maxHeight: "100vh" }}></div>*/}
      <div
        style={{
          display: "flex",
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 18,
          paddingRight: 18,
          borderBottom: "1px solid #000",
          fontWeight: 700,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          Comparing M4 with Others
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <DateTimeRangePicker onChange={onChange} value={value} />
          </div>
          <button onClick={() => saveChart()}>Compute DSSIM</button>
        </div>
      </div>
      <HorizontalChartCard
        datasetName={"SPDR S&P 500 Trades"}
        dataReductionMethod={"M4_Aggregation"}
        totalTime={aggregationResponseTime}
        data={data}
        xVariable={"x"}
        yVariable={"y"}
        height={height}
        setHeight={setHeight}
        width={width}
        setWidth={setWidth}
      />
      <HorizontalChartCard
        datasetName={"SPDR S&P 500 Trades"}
        dataReductionMethod={"Raw_Data"}
        data={rawData}
        totalTime={rawResponseTime}
        xVariable={"x"}
        yVariable={"y"}
        height={height}
        setHeight={setHeight}
        width={width}
        setWidth={setWidth}
      />
      {/*<input*/}
      {/*  type={"number"}*/}
      {/*  value={fromTime}*/}
      {/*  onChange={(event) => setFromTime(event.target.value)}*/}
      {/*  step={"3600"}*/}
      {/*/>{" "}*/}
      {/*<input*/}
      {/*  type={"number"}*/}
      {/*  value={toTime}*/}
      {/*  onChange={(event) => setToTime(event.target.value)}*/}
      {/*  step={"3600"}*/}
      {/*/>*/}
      {/*<LineChart*/}
      {/*  width={500}*/}
      {/*  height={300}*/}
      {/*  data={data}*/}
      {/*  xVariable={"x"}*/}
      {/*  yVariable={"y"}*/}
      {/*/>*/}
      {/*{aggregationResponseTime}*/}
      {/*<LineChart*/}
      {/*  width={500}*/}
      {/*  height={300}*/}
      {/*  data={rawData}*/}
      {/*  xVariable={"x"}*/}
      {/*  yVariable={"y"}*/}
      {/*/>*/}
      {/*{rawResponseTime}*/}
    </div>
  );
}

export default App;
