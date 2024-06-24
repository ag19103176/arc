import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./toggle.css";

const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const CustomPieChart = ({ data }) => {
  const formattedData = data.json_data.map((item, index) => ({
    id: item._id || index,
    value: item.value,
    label: item.label,
    color: item.color || `hsl(${(index * 40) % 360}, 70%, 50%)`,
  }));

  const chunkSize = 9;
  const legendChunks = chunkArray(formattedData, chunkSize);
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < legendChunks.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pieData = {
    labels: formattedData.map((item) => item.label),
    datasets: [
      {
        data: formattedData.map((item) => item.value),
        backgroundColor: formattedData.map((item) => item.color),
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: data.chartElements.pieChart.legend,
      },
    },
  };

  return (
    <div className="chart-body">
      <Pie data={pieData} options={options} width={300} height={500} />

      {data.chartElements.pieChart.legend && (
        <div className="custom-legend">
          {legendChunks[currentPage].map((item, index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="legend-label">{item.label}</span>
            </div>
          ))}
          <div className="legend-stepper">
            <button onClick={handlePrev} disabled={currentPage === 0}>
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === legendChunks.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;
