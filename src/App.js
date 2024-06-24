import React, { useEffect, useState } from "react";
import axios from "axios";
import PieChart from "./Components/Graph/pieChart.js";
import DataDisplayComponent from "./Components/DataDisplayAxes/CommonDisplay.js";
import BarChart from "./Components/Graph/barChart.js";
import LineChart from "./Components/Graph/lineChart.js";
import Loader from "./Components/Loader/loader.js";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./App.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
const mongoose = require("mongoose");

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function App() {
  const sources = [
    { name: "customers" },
    { name: "invoices" },
    { name: "ticket" },
  ];

  const structures = [
    { name: "Pie Graph", id: 1 },
    { name: "Bar Graph", id: 2 },
    { name: "Line Graph", id: 3 },
  ];

  const [selectedSource, setSelectedSource] = useState("");
  const [dim, setDim] = useState("");
  const [measure, setMeasure] = useState("");
  const [type, setType] = useState("");
  const [displayGraph, setDisplayGraph] = useState([]);
  const [graph, setGraph] = useState(false);
  const [addButton, setAddButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [graphEdit, setGraphEdit] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [legend, setLegend] = useState(false);
  const [total, setTotal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState([]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [objid, setObjid] = useState("");
  // const [position, setPosition] = useState({});
  const [selectPercentage, setSelectPercentage] = useState("");
  const [slicePercentage, setSlicePercentage] = useState("");
  const [goalLine, setGoalLine] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const [goalValue, setGoalValue] = useState("");
  const [goalLabel, setGoalLabel] = useState("");
  const [valueToShow, setValueToShow] = useState("");
  const [LabelDisplayMode, setLabelDisplayMode] = useState(false);

  const handleRefreshClick = (val) => {
    setTimeout(() => {
      setGraph(!graph);
    }, val * 60 * 1000);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/getGraph");
        const data = response.data;
        console.log("dataaa", data);
        // console.log(data[0].graph);
        let id = data[0]._id;
        console.log(id);
        setObjid(() => data[0]._id); // TODO
        setDisplayGraph(data[0].graph);
        // console.log(_Objid);
      } catch (error) {
        console.log("error in app js ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [graph]);

  const handleEdit = async (graphData) => {
    console.log("abc", graphData);
    setLoading(true);
    setSelectedSource(graphData.chartSource);
    setDim(graphData.field1);
    setMeasure(graphData.field2);
    setType(graphData.chartType);
    setId(graphData._id);
    if (graphData.chartType === "1") {
      setLegend(graphData.chartElements.pieChart.legend);
      setTotal(graphData.chartElements.pieChart.total);
      setSelectPercentage(graphData.chartElements.pieChart.selectPercentage);
      setSlicePercentage(graphData.chartElements.pieChart.minSlicePercentage);
    } else if (graphData.chartType === "2") {
      setGoalLine(graphData.chartElements.barLineChart.goalLine);
      setShowValue(graphData.chartElements.barLineChart.showValue);
      setGoalValue(graphData.chartElements.barLineChart.GoalValue);
      setGoalLabel(graphData.chartElements.barLineChart.GoalLabel);
      setValueToShow(graphData.chartElements.barLineChart.valueToShow);
      setLabelDisplayMode(
        graphData.chartElements.barLineChart.LabelDisplayMode
      );
    }

    setShowModal(true);
    setAddButton(true);
    setGraphEdit(true);
    setLoading(false);
  };
  const handleGenerateGraphClick = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/getGroup", {
        params: {
          chartSource: selectedSource,
          field1: dim,
          field2: "id",
        },
      });
      console.log(response.data.data);
      const dataLabel = response.data.data.filter(
        (item) => item.label !== null
      );
      const requestData = {
        chartSource: selectedSource,
        json_data: dataLabel,
        chartType: type,
        field1: dim,
        field2: measure,
        position: layout,
        chartElements: {},
      };
      if (type === "1") {
        requestData.chartElements = {
          pieChart: {
            legend: legend,
            total: total,
            selectPercentage: selectPercentage,
            minSlicePercentage: slicePercentage,
          },
        };
      } else if (type === "2") {
        requestData.chartElements = {
          barLineChart: {
            goalLine: goalLine,
            goalValue: goalValue,
            goalLabel: goalLabel,
            showValues: showValue,
            valueToShow: valueToShow,
            // LabelDisplayMode: LabelDisplayMode,
            showLabel: true,
            label: "Some Label",
            LabelDisplayMode: LabelDisplayMode,
            yShowLabel: true,
            yLabel: "Y-Axis Label",
            yshowLineAndMarks: true,
          },
        };
      }
      console.log(requestData);
      if (dataLabel.length) {
        if (id.startsWith("tempId")) {
          const newId = mongoose.Types.ObjectId();
          requestData._id = newId;
          await axios.patch("http://localhost:8000/api/saveGraph", requestData);
        } else {
          await axios.patch("http://localhost:8000/api/saveGraph", requestData);
        }
      }
      setGraph(!graph);
      setShowModal(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleGenerateEditGraph = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/getGroup", {
        params: {
          chartSource: selectedSource,
          field1: dim,
          field2: "id",
        },
      });
      const dataLabel = response.data.data.filter(
        (item) => item.label !== null
      );

      const updatedData = {
        chartSource: selectedSource,
        json_data: dataLabel,
        chartType: type,
        field1: dim,
        field2: measure,
        position: layout,
        chartElements: {},
      };
      if (type === "1") {
        updatedData.chartElements = {
          pieChart: {
            legend: legend,
            total: total,
            selectPercentage: selectPercentage,
            minSlicePercentage: slicePercentage,
          },
        };
      } else if (type === "2") {
        updatedData.chartElements = {
          barLineChart: {
            goalLine: goalLine,
            goalValue: goalValue,
            goalLabel: goalLabel,
            showValues: showValue,
            valueToShow: valueToShow,
            // LabelDisplayMode: LabelDisplayMode,
            showLabel: true,
            label: "Some Label",
            LabelDisplayMode: LabelDisplayMode,
            yShowLabel: true,
            yLabel: "Y-Axis Label",
            yshowLineAndMarks: true,
          },
        };
      }
      await axios.patch(
        `http://localhost:8000/api/updateGraph/${objid}/${id}`,
        updatedData
        // layout
      );
      setId("");
      setShowModal(false);
      setAddButton(false);
      setLegend(false);
      setTotal(false);
      setSelectPercentage("");
      setSlicePercentage("");
      setGoalLine(false);
      setShowValue(false);
      setGoalValue("");
      setGoalLabel("");
      setValueToShow("");
      setLabelDisplayMode("");
      setGraph(!graph);
    } catch (error) {
      console.error("Error updating graph:", error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    // console.log("Delete button clicked for ID:", id);
    setLoading(true);
    try {
      await axios.patch(`http://localhost:8000/api/deleteGraph/${objid}`, {
        id: id,
      });

      setGraph(!graph);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleSourceChange = (value) => {
    setSelectedSource(value);
  };

  const handleDimension = (value) => {
    setDim(value);
  };
  const handleMeasure = (value) => {
    setMeasure(value);
  };

  const selectGraph = (e) => {
    setType(e.target.value);
  };

  const handleAddButton = () => {
    setLoading(true);
    setAddButton(true);
    setShowModal(true);
    setGraphEdit(false);
    setSelectedSource("");
    setDim("");
    setMeasure("");
    setType("");
    setLegend(false);
    setTotal(false);
    setSelectPercentage("");
    setSlicePercentage("");
    setGoalLine(false);
    setShowValue(false);
    setLoading(false);
    setGoalValue("");
    setGoalLabel("");
    setValueToShow("");
    setLabelDisplayMode("");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const onLayoutChange = (newLayout, id) => {
    setLayout(newLayout);
    saveLayoutToBackend(newLayout, objid, id);
    console.log("Layout changed:", layout);
  };

  const minWidth = 2;
  const minHeight = 4;
  const maxWidth = 7;
  const maxHeight = 7;

  const generateLayout = (graphs) => {
    return graphs.map((graph, index) => ({
      i: graph.id?.toString() || index.toString(),
      x: (index % 4) * 3,
      y: Math.floor(index / 4) * 5,
      w: graph.chartType === `2` ? 5 : 3,
      h: 5.8,
      minW: minWidth,
      minH: minHeight,
      maxW: maxWidth,
      maxH: maxHeight,
    }));
  };
  const saveLayoutToBackend = async (layout, objid, id) => {
    try {
      const updatedGraphs = layout.map((item) => ({
        // abc: item.i, // Graph ID
        position: {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        },
      }));
      // console.log("ssss", objid);
      // console.log("sseee", id);

      // // Make a PATCH request to your backend API to update graph positions
      // await axios.patch(
      //   `http://localhost:8000/api/updateGraphPositions/${objid}`,
      //   { id: id, updatedGraphs }
      // );
      console.log("Layout saved:", layout);
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleDragDrop = () => {
    setIsDraggable(!isDraggable);
  };
  const handlelegend = (value) => {
    setLegend(value);
  };
  const handleTotal = (value) => {
    setTotal(value);
  };
  const handleSelectPercentage = (value) => {
    // console.log("in app handleSelectPercentage", value);
    setSelectPercentage(value);
  };
  const handleslicePercentage = (value) => {
    console.log("in app setSlice", value);
    setSlicePercentage(value);
  };
  const handleGoalLine = (value) => {
    setGoalLine(value);
  };
  const handleShowDataLabels = (value) => {
    setShowValue(value);
  };
  const handleGoalValue = (value) => {
    setGoalValue(value);
  };
  const handleLabel = (value) => {
    console.log("label", value);
    setGoalLabel(value);
  };
  // const handleShowValue = (value) => {
  //   setValueToShow(value);
  // };
  const handleShow = (value) => {
    setValueToShow(value);
  };
  const handleDisplayChange = (value) => {
    setLabelDisplayMode(value);
  };
  return (
    <div className="App">
      {loading && <Loader />}
      <div className="main-box">
        <div className="control-panel">
          <div className="control-row">
            <button className="add-button" onClick={handleAddButton}>
              + ADD GRAPH
            </button>

            <select
              className="form-control select-class input"
              style={{ width: "15%" }}
              defaultValue="0"
              onChange={(e) => handleRefreshClick(e.target.value)}
            >
              <option value={0} disabled>
                Select Time to Refresh
              </option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>

            <label className="label rearrange">Resize/Rearrange</label>
            <label className="switch">
              <input
                type="checkbox"
                onChange={handleToggleDragDrop}
                checked={isDraggable}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {addButton && showModal && (
          <div className="box">
            <div className="modal-container">
              <div className="modal-content">
                <select
                  id="ddlOptions1"
                  className="form-control select-class input"
                  value={selectedSource}
                  onChange={(e) => handleSourceChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select Source
                  </option>
                  {sources.map((option, index) => (
                    <option key={index} value={option.name} className="option">
                      {option.name}
                    </option>
                  ))}
                </select>
                <select
                  id="ddlOptions2"
                  className="form-control select-class input"
                  value={type}
                  onChange={selectGraph}
                >
                  <option value="" disabled>
                    Select Graph
                  </option>
                  {structures.map((option, index) => (
                    <option key={index} value={option.id} className="option">
                      {option.name}
                    </option>
                  ))}
                </select>

                <div>
                  {["customers", "ticket", "invoices"].map(
                    (source, index) =>
                      selectedSource === source && (
                        <DataDisplayComponent
                          key={index}
                          type={type}
                          handleDimension={handleDimension}
                          handleMeasure={handleMeasure}
                          setDimen={dim}
                          setMea={measure}
                          selectedSource={selectedSource}
                          handlelegend={handlelegend}
                          // legendedit={legend}
                          handleTotal={handleTotal}
                          setTot={total}
                          setDim={dim}
                          handleSelectPercentage={handleSelectPercentage}
                          selectPercentage={selectPercentage}
                          handleslicePercentage={handleslicePercentage}
                          setSlice={slicePercentage}
                          handleGoalLine={handleGoalLine}
                          goal={goalLine}
                          handleShowDataLabels={handleShowDataLabels}
                          showValue={showValue}
                          handleGoalValue={handleGoalValue}
                          goalValue={goalValue}
                          handleLabel={handleLabel}
                          goalLabel={goalLabel}
                          // handleShowValue={handleShowValue}
                          handleShow={handleShow}
                          valueToShow={valueToShow}
                          handleDisplayChange={handleDisplayChange}
                          LabelDisplayMode={LabelDisplayMode}
                        />
                      )
                  )}
                </div>
                <div className="modal-button-container">
                  <button
                    className="generate-button"
                    onClick={
                      graphEdit
                        ? handleGenerateEditGraph
                        : handleGenerateGraphClick
                    }
                  >
                    {graphEdit ? "Edit Graph" : "Generate Graph"}
                  </button>
                  <button className="cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ResponsiveReactGridLayout
        className="layout"
        rowHeight={60}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        layout={generateLayout(displayGraph)}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        isDroppable={true}
        droppingItem={{ i: "xx", h: 50, w: 250 }}
        isResizable={isDraggable}
        isDraggable={isDraggable}
      >
        {layout &&
          displayGraph.map((d, index) => (
            <div
              key={d._id}
              className="chart-card"
              data-grid={generateLayout(displayGraph)[index]}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="Btn">
                <div
                  onClick={() => {
                    handleEdit(d);
                  }}
                >
                  <button className="edit">Edit</button>
                </div>
                <div
                  onClick={() => {
                    handleDelete(d._id);
                  }}
                >
                  <button className="edit">Delete</button>
                </div>
              </div>
              {d.chartType === "1" ? (
                <PieChart data={d} />
              ) : d.chartType === "2" ? (
                <BarChart data={d.json_data} />
              ) : d.chartType === "3" ? (
                <LineChart data={d.json_data} />
              ) : null}
            </div>
          ))}
      </ResponsiveReactGridLayout>
    </div>
  );
}

export default App;
