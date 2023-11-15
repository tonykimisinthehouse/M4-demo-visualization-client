import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import toImg from "react-svg-to-image";

import "./App.css";
import { useCallback, useEffect, useState } from "react";
import HorizontalChartCard from "./molecules/HorizontalChartCard";

import { base64ImageToBlob } from "./utils";

const backend_url = "http://localhost:8000";
// const backend_url = "http://18.222.117.210:8000";
// const backend_url = "http://3.138.181.40:8000";

function App() {
  // const [fromTime, setFromTime] = useState(1698638400);
  // const [toTime, setToTime] = useState(1698677288);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const [m4Loaded, setM4Loaded] = useState(false);
  const [rawLoaded, setRawLoaded] = useState(false);
  const [m4QueryExecutionTime, setM4QueryExecutionTime] = useState(0);
  const [rawQueryExecutionTime, setRawQueryExecutionTime] = useState(0);
  const [m4TotalTime, setM4TotalTime] = useState(0);
  const [rawTotalTime, setRawTotalTime] = useState(0);
  const [value, onChange] = useState([
    new Date(1698638400 * 1000),
    new Date(1698652800 * 1000),
  ]);
  const [DSSIM, setDSSIM] = useState(null);
  const [SSIM, setSSIM] = useState(null);

  const m4_id = `M4_Aggregation_${value[0]?.getTime() / 1000}_${
    value[1]?.getTime() / 1000
  }`;
  const raw_data_id = `Raw_Data_${value[0]?.getTime() / 1000}_${
    value[1]?.getTime() / 1000
  }`;

  useEffect(() => {
    const fetchData = async () => {
      if (width > 0) {
        try {
          setM4Loaded(false);
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
          setData(jsonData?.records);
          setM4QueryExecutionTime(jsonData?.query_execution_time);

          // while (document.getElementById(`${m4_id}_path`) === null) {}
          let interval_id = setInterval(() => {
            if (document.getElementById(`${m4_id}_path`) !== null) {
              const secSpent = (Date.now() - start_time) / 1000;
              setM4TotalTime(secSpent);
              setM4Loaded(true);
              clearInterval(interval_id);
            }
          }, 10);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
  }, [value, width, height, m4_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let start_time = Date.now();
        setRawLoaded(false);
        const response = await fetch(
          `${backend_url}/get_raw_time_series?from_time=${Math.round(
            value[0].getTime() / 1000
          )}&to_time=${Math.round(value[1].getTime() / 1000)}`
        );
        const secSpent = (Date.now() - start_time) / 1000;
        const jsonData = await response.json();
        // console.log(jsonData.map((x) => ({ value: x[0], label: x[1] })));
        setRawData(jsonData?.records);
        setRawQueryExecutionTime(jsonData?.query_execution_time);
        // while (document.getElementById(`${raw_data_id}_path`) === null) {}
        let interval_id = setInterval(() => {
          if (document.getElementById(`${raw_data_id}_path`) !== null) {
            const secSpent = (Date.now() - start_time) / 1000;
            setRawTotalTime(secSpent);
            setRawLoaded(true);
            clearInterval(interval_id);
          }
        }, 10);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [raw_data_id, value]);
  useEffect(() => {
    setDSSIM(null);
    setSSIM(null);
  }, [value]);
  useEffect(() => {
    let interval_id = setInterval(() => {
      if (m4Loaded && rawLoaded) {
        fetch(
          `${backend_url}/record_query_performance?num_of_underlying_rows=${rawData?.length}&base_execution_time=${rawQueryExecutionTime}&base_total_time=${rawTotalTime}&m4_execution_time=${m4QueryExecutionTime}5&m4_total_time=${m4TotalTime}`,
          {
            method: "POST",
          }
        );
        clearInterval(interval_id);
      }
    }, 1000);
  }, [
    m4Loaded,
    m4QueryExecutionTime,
    m4TotalTime,
    m4_id,
    rawData?.length,
    rawLoaded,
    rawQueryExecutionTime,
    rawTotalTime,
    raw_data_id,
    value,
  ]);

  const computeEvaluationMetrics = useCallback(async () => {
    const m4ChartImage = await toImg(`.${m4_id}_svg`, `sample-M4_Aggregation`, {
      scale: 1,
      format: "jpg",
      quality: 1,
      download: false,
    });
    const rawChartImage = await toImg(
      `.${raw_data_id}_svg`,
      `sample-Raw_Data`,
      {
        scale: 1,
        format: "jpg",
        quality: 1,
        download: false,
      }
    );
    const formData = new FormData();
    formData.append(
      "image_1",
      new File([base64ImageToBlob(m4ChartImage)], `sample-M4_Aggregation`, {
        type: "image/png",
      })
    );
    formData.append(
      "image_2",
      new File([base64ImageToBlob(rawChartImage)], `sample-Raw_Data`, {
        type: "image/png",
      })
    );

    const res = await fetch(`${backend_url}/compute_dssim`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    await fetch(
      `${backend_url}/record_visualization_quality?num_of_underlying_rows=${rawData?.length}&dssim=${res.dssim}&ssim=${res.ssim}`,
      {
        method: "POST",

        headers: { "Content-Type": "application/json" },
      }
    );
    setDSSIM(res.dssim);
    setSSIM(res.ssim);
    // alert(JSON.stringify(`${res.dssim}, status: ${res.status}`));
  }, [m4_id, rawData?.length, raw_data_id]);

  return (
    <div
    // style={{ display: "flex", maxHeight: "100%", boxSizing: "border-box" }}
    >
      {/*<div style={{ maxHeight: "100vh" }}></div>*/}
      <div
        style={{
          display: "flex",
          paddingTop: 8,
          paddingBottom: 4,
          paddingLeft: 18,
          paddingRight: 18,
          fontWeight: 700,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          Comparing M4 with Others
        </div>
      </div>
      <div
        style={{
          paddingTop: 4,
          paddingBottom: 8,
          paddingLeft: 18,
          paddingRight: 18,
          display: "flex",
          justifyContent: "end",
          borderBottom: "1px solid #000",
        }}
      >
        <div>
          <DateTimeRangePicker onChange={onChange} value={value} />
        </div>
        <button onClick={() => computeEvaluationMetrics()}>
          Compute DSSIM
        </button>
      </div>

      <HorizontalChartCard
        datasetName={"SPDR S&P 500 Trades"}
        dataReductionMethod={"M4_Aggregation"}
        totalTime={m4TotalTime}
        data={data}
        xVariable={"0"}
        yVariable={"1"}
        height={height}
        setHeight={setHeight}
        width={width}
        setWidth={setWidth}
        id={m4_id}
        loaded={m4Loaded}
        additional_information={{
          ...(m4Loaded ? { "Query Execution Time": m4QueryExecutionTime } : {}),
          ...(DSSIM ? { DSSIM: DSSIM, SSIM: SSIM } : {}),
        }}
        chartStart={Math.round(value[0].getTime() / 1000)}
        chartEnd={Math.round(value[1].getTime() / 1000)}
      />
      <HorizontalChartCard
        datasetName={"SPDR S&P 500 Trades"}
        dataReductionMethod={"Raw_Data"}
        data={rawData}
        totalTime={rawTotalTime}
        xVariable={"0"}
        yVariable={"1"}
        height={height}
        setHeight={setHeight}
        width={width}
        setWidth={setWidth}
        id={raw_data_id}
        loaded={rawLoaded}
        additional_information={{
          ...(rawLoaded
            ? { "Query Execution Time": rawQueryExecutionTime }
            : {}),
        }}
        chartStart={Math.round(value[0].getTime() / 1000)}
        chartEnd={Math.round(value[1].getTime() / 1000)}
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
      {/*{m4TotalTime}*/}
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
