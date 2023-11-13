import logo from "./logo.svg";
import "./App.css";
import LineChart from "./components/LineChart";
import { useEffect, useState } from "react";

function App() {
  const [fromTime, setFromTime] = useState(1698638400);
  const [toTime, setToTime] = useState(1698677288);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://18.222.117.210:8000/get_time_series?from_time=${fromTime}&to_time=${toTime}&chart_width=500&chart_height=100`
        );
        const jsonData = await response.json();
        // console.log(jsonData.map((x) => ({ value: x[0], label: x[1] })));
        setData(jsonData.map((x) => ({ x: x[0], y: x[1] })));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [fromTime, toTime]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://18.222.117.210:8000/get_raw_time_series?from_time=${fromTime}&to_time=${toTime}`
        );
        const jsonData = await response.json();
        // console.log(jsonData.map((x) => ({ value: x[0], label: x[1] })));
        setRawData(jsonData.map((x) => ({ x: x[0], y: x[1] })));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [fromTime, toTime]);

  return (
    <div>
      <input
                    type={"number"}

        value={fromTime}
        onChange={(event) => setFromTime(event.target.value)}
        step={"3600"}
      />{" "}
      <input
          type={"number"}
        value={toTime}
        onChange={(event) => setToTime(event.target.value)}
        step={"3600"}
      />
      <LineChart width={500} height={300} data={data} xVariable={'x'} yVariable={'y'} />
      <LineChart width={500} height={300} data={rawData} xVariable={'x'} yVariable={'y'} />
    </div>
  );
}

export default App;
