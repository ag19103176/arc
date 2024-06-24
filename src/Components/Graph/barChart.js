import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components and the plugins
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  ChartDataLabels
);

const BarChartWithGoal = ({ data }) => {
  const [goal, setGoal] = useState(0);
  const [labelText, setLabelText] = useState("Goal");
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [valueToShow, setValueToShow] = useState("Some");
  const [showXAxisLabel, setShowXAxisLabel] = useState(true);
  const [showYAxisLabel, setShowYAxisLabel] = useState(true);
  const [xAxisLabelDisplayMode, setXAxisLabelDisplayMode] = useState("Show");
  const [xAxisLabelText, setXAxisLabelText] = useState("Month");
  const [yAxisLabelText, setYAxisLabelText] = useState("Time");

  const handleGoalChange = (e) => {
    setGoal(Number(e.target.value));
  };

  const handleLabelChange = (e) => {
    setLabelText(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setShowDataLabels(e.target.checked);
  };

  const handleValueToShowChange = (e) => {
    setValueToShow(e.target.value);
  };

  const handleXAxisLabelChange = (e) => {
    setShowXAxisLabel(e.target.checked);
  };

  const handleYAxisLabelChange = (e) => {
    setShowYAxisLabel(e.target.checked);
  };

  const handleXAxisLabelDisplayModeChange = (e) => {
    setXAxisLabelDisplayMode(e.target.value);
  };

  const handleXAxisLabelTextChange = (e) => {
    setXAxisLabelText(e.target.value);
  };

  const handleYAxisLabelTextChange = (e) => {
    setYAxisLabelText(e.target.value);
  };

  const ChartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Dataset",
        data: data.map((d) => d.value),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
      annotation: {
        annotations: {
          goalLine: {
            type: "line",
            mode: "horizontal",
            scaleID: "y",
            value: goal,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: `${labelText}: ${goal}`,
              enabled: true,
              position: "end",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "red",
              yAdjust: -10,
            },
          },
        },
      },
      datalabels: {
        display: showDataLabels,
        align: "end",
        anchor: "end",
        formatter: (value, context) => {
          if (valueToShow === "All") {
            return value;
          } else {
            if (context.dataIndex % 2 === 0) {
              return value;
            } else {
              return "";
            }
          }
        },
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: showXAxisLabel,
          text: xAxisLabelText,
        },
        ticks: {
          display: xAxisLabelDisplayMode !== "Hide",
          autoSkip: true,
          maxRotation: xAxisLabelDisplayMode === "Rotate 90°" ? 90 : 0,
          minRotation: xAxisLabelDisplayMode === "Rotate 45°" ? 45 : 0,
          callback: (value) => {
            if (xAxisLabelDisplayMode === "Compact") {
              return value.substring(0, 3);
            } else {
              return value;
            }
          },
        },
      },
      y: {
        // type: scaleType,
        // beginAtZero: scaleType === 'linear', // Only set beginAtZero for linear scale
        title: {
          display: showYAxisLabel,
          text: yAxisLabelText,
        },
      },
    },
  };

  return (
    // <div>
    //   <div style={{ marginBottom: "20px" }}>
    //     <input
    //       type="number"
    //       value={goal}
    //       onChange={handleGoalChange}
    //       placeholder="Set goal"
    //       style={{ marginRight: "10px" }}
    //     />
    //     <input
    //       type="text"
    //       value={labelText}
    //       onChange={handleLabelChange}
    //       placeholder="Set goal label"
    //       style={{ marginRight: "10px" }}
    //     />
    //     <label>
    //       <input
    //         type="checkbox"
    //         checked={showDataLabels}
    //         onChange={handleCheckboxChange}
    //       />
    //       Show Data Labels
    //     </label>
    //   </div>
    //   <div>
    //     <div>
    //       <label>Value to Show</label>
    //     </div>
    //     <div>
    //       <label>
    //         <input
    //           type="radio"
    //           value="Some"
    //           checked={valueToShow === "Some"}
    //           onChange={handleValueToShowChange}
    //         />
    //         Some
    //       </label>
    //       <label>
    //         <input
    //           type="radio"
    //           value="All"
    //           checked={valueToShow === "All"}
    //           onChange={handleValueToShowChange}
    //         />
    //         All
    //       </label>
    //     </div>
    //   </div>
    //   <div>
    //     <label>
    //       <input
    //         type="radio"
    //         value="Hide"
    //         checked={xAxisLabelDisplayMode === "Hide"}
    //         onChange={handleXAxisLabelDisplayModeChange}
    //       />
    //       Hide
    //     </label>
    //     <label>
    //       <input
    //         type="radio"
    //         value="Show"
    //         checked={xAxisLabelDisplayMode === "Show"}
    //         onChange={handleXAxisLabelDisplayModeChange}
    //       />
    //       Show
    //     </label>
    //     <label>
    //       <input
    //         type="radio"
    //         value="Rotate 45°"
    //         checked={xAxisLabelDisplayMode === "Rotate 45°"}
    //         onChange={handleXAxisLabelDisplayModeChange}
    //       />
    //       Rotate 45°
    //     </label>
    //     <label>
    //       <input
    //         type="radio"
    //         value="Rotate 90°"
    //         checked={xAxisLabelDisplayMode === "Rotate 90°"}
    //         onChange={handleXAxisLabelDisplayModeChange}
    //       />
    //       Rotate 90°
    //     </label>
    //   </div>
    //   <div>
    //     <label>
    //       <input
    //         type="checkbox"
    //         checked={showXAxisLabel}
    //         onChange={handleXAxisLabelChange}
    //       />
    //       Show X-Axis Label
    //     </label>
    //     <input
    //       type="text"
    //       value={xAxisLabelText}
    //       onChange={handleXAxisLabelTextChange}
    //       placeholder="X-Axis Label"
    //       style={{ marginRight: "10px" }}
    //     />
    //     <label>
    //       <input
    //         type="checkbox"
    //         checked={showYAxisLabel}
    //         onChange={handleYAxisLabelChange}
    //       />
    //       Show Y-Axis Label
    //     </label>
    //     <input
    //       type="text"
    //       value={yAxisLabelText}
    //       onChange={handleYAxisLabelTextChange}
    //       placeholder="Y-Axis Label"
    //       style={{ marginRight: "10px" }}
    //     />
    //   </div>

    <Bar data={ChartData} options={options} />
    // </div>
  );
};

export default BarChartWithGoal;
