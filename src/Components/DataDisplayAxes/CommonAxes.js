import React, { useState } from "react";

const Axes = ({ LabelDisplayMode, handleDisplayModeChange }) => {
  const [xAxisState, setXAxisState] = useState({
    showLabel: false,
    label: "",
    showLinesAndMarks: "Show",
  });

  const [yAxisState, setYAxisState] = useState({
    showLabel: false,
    label: "",
    showLinesAndMarks: "Show",
  });

  const auto = ["Hide", "Show", "Compact", "Rotate45", "Rotate90"];
  // const [LabelDisplayMode, setLabelDisplayMode] = useState("");

  const handleToggleXAxis = (event) => {
    const { name, checked } = event.target;
    setXAxisState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleChangeXAxis = (event) => {
    const { name, value } = event.target;
    setXAxisState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleToggleYAxis = (event) => {
    const { name, checked } = event.target;
    setYAxisState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleChangeYAxis = (event) => {
    const { name, value } = event.target;
    setYAxisState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="axes">
      <div className="form-group">
        <h4>X-Axis</h4>
        <div>
          <label htmlFor="xAxisShowLabel">Show Label</label>
          <label className="switch">
            <input
              type="checkbox"
              id="xAxisShowLabel"
              name="showLabel"
              checked={xAxisState.showLabel}
              onChange={handleToggleXAxis}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {xAxisState.showLabel && (
          <div>
            <label htmlFor="xAxisLabel">Label</label>
            <div>
              <input
                type="text"
                id="xAxisLabel"
                name="label"
                value={xAxisState.label}
                onChange={handleChangeXAxis}
                required={xAxisState.showLabel}
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="yAxisShowLinesAndMarks">Show Lines and Marks</label>
      </div>

      <div>
        {auto.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={option}
              name="auto"
              value={option}
              checked={LabelDisplayMode === option}
              onChange={(e) => handleDisplayModeChange(e.target.value)}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
      <h4>Y-Axis</h4>
      <div>
        <label htmlFor="yAxisShowLabel">Show Label</label>
        <label className="switch">
          <input
            type="checkbox"
            id="yAxisShowLabel"
            name="showLabel"
            checked={yAxisState.showLabel}
            onChange={handleToggleYAxis}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {yAxisState.showLabel && (
        <div>
          <label htmlFor="yAxisLabel">Label</label>
          <div>
            <input
              type="text"
              id="yAxisLabel"
              name="label"
              value={yAxisState.label}
              onChange={handleChangeYAxis}
              required={yAxisState.showLabel}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="yAxisShowLinesAndMarks">Show Lines and Marks</label>
      </div>

      <div>
        {auto.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={option}
              name="auto"
              value={option}
              checked={LabelDisplayMode === option}
              onChange={(e) => handleDisplayModeChange(e.target.value)}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Axes;
