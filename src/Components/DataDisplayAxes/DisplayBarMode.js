import React, { useState } from "react";

const DisplayBarMode = ({
  handleGoalValueChange,
  goalValue,
  goalLabel,
  handleLabelChange,
  valueToShow,
  handleSelectShow,
}) => {
  const [goal, setGoal] = useState(false);
  const [showDataLabels, setShowDataLabels] = useState(false);

  const handleGoalChange = (e) => {
    setGoal(e.target.checked);
  };

  const handleCheckboxChange = (e) => {
    setShowDataLabels(e.target.checked);
  };

  const barOptions = ["Some", "All"];

  return (
    <div className="display-section">
      <div className="legend">
        <label className="label">Goal Line</label>
        <label className="switch">
          <input type="checkbox" checked={goal} onChange={handleGoalChange} />
          <span className="slider round"></span>
        </label>
      </div>

      {goal && (
        <div className="goal-section">
          <div className="goal-input">
            <label>Goal Value</label>
            <input
              value={goalValue}
              onChange={(e) => handleGoalValueChange(e.target.value)}
            />
          </div>
          <div className="goal-input">
            <label>Goal Label</label>
            <input
              value={goalLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="legend">
        <label className="label">Show values on data points</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={showDataLabels}
            onChange={handleCheckboxChange}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {showDataLabels && (
        <div>
          <div>
            <label>Value to Show</label>
            <div>
              {barOptions.map((option, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    id={option}
                    name="barOption"
                    value={option}
                    checked={valueToShow === option}
                    onChange={() => handleSelectShow(option)}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayBarMode;
