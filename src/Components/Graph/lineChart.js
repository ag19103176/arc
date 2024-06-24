import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import "./toggle.css";

const LineChartCard = ({ data }) => {
  const parsedData = data.map((item) => ({ x: item.label, y: item.value }));
  console.log(
    "graph",
    parsedData.map((item) => item.x)
  );
  console.log(parsedData.map((item) => item.y));
  return (
    <div>
      <div className="chart-body">
        <LineChart
          xAxis={[{ data: parsedData.map((item) => item.x) }]}
          series={[
            {
              data: parsedData.map((item) => item.y),
            },
          ]}
          width={400}
          height={300}
        />
      </div>
    </div>
  );
};

export default LineChartCard;
