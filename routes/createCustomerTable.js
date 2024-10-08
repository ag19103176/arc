const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const CommonSchema = require("../models/commonSchema");
const Customer = require("../models/customerModel");
const customerData = require("../src/data1/customer.json");
const Invoice = require("../models/invoiceModel");
const invoiceData = require("../src/data1/invoice.json");
const DisplaySchema = require("../models/displayModel");
const BarSchema = require("../models/barModel");
// const GridPositionSchema = require("../models/gridposition");
const db = require("../db");
const { layouts } = require("chart.js");
const schemas = {
  customers: Customer,
  commonschemas: CommonSchema,
  displayschema: DisplaySchema,
  // gridPositionSchema: GridPositionSchema,
};

router.get("/createCustomerTable", async (req, res) => {
  try {
    await Customer.createCollection();
    console.log("Collection created successfully");
    res.status(200).send("Collection created successfully");
  } catch (err) {
    console.error("Error creating collection: ", err.message);
    res.status(500).send("Error creating collection");
  }
});
router.get("/createInvoiceTable", async (req, res) => {
  try {
    await Invoice.createCollection();
    console.log("Collection created successfully");
    res.status(200).send("Collection created successfully");
  } catch (err) {
    console.error("Error creating collection: ", err.message);
    res.status(500).send("Error creating collection");
  }
});

router.post("/insertCustomerTable", async (req, res) => {
  try {
    await Customer.insertMany(customerData);
    console.log("Records inserted successfully");
    res.status(200).send("Records inserted successfully");
  } catch (err) {
    console.error("Error inserting records: ", err.message);
    res.status(500).send("Error inserting records");
  }
});
router.post("/insertInvoiceTable", async (req, res) => {
  try {
    await Invoice.insertMany(invoiceData);
    console.log("Records inserted successfully");
    res.status(200).send("Records inserted successfully");
  } catch (err) {
    console.error("Error inserting records: ", err.message);
    res.status(500).send("Error inserting records");
  }
});

router.get("/getAllData", async (req, res) => {
  const { chartSource } = req.query;
  console.log("Table name:", chartSource);
  try {
    if (!chartSource || !schemas[chartSource]) {
      console.error("Invalid table name:", chartSource);
      return res.status(400).send("Invalid table name");
    }
    const data = await schemas[chartSource].find();
    res.send(data);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).send("Error fetching data");
  }
});

router.get("/getGroup", async (req, res) => {
  try {
    const { chartSource, field1, field2 } = req.query;

    if (!chartSource || !field1 || !field2) {
      return res.status(400).send("Table name and fields are required.");
    }
    const response = await schemas[chartSource].aggregate([
      { $group: { _id: `$${field1}`, value: { $sum: 1 } } },
      { $project: { _id: 0, label: `$_id`, value: 1 } },
    ]);
    console.log(response);

    res.send({
      status: 200,
      msg: "Request processed successfully",
      data: response,
    });
  } catch (err) {
    console.error("Error fetching data: ", err.message);
    res.status(500).send("Error fetching data");
  }
});
router.post("/saveGraph", async (req, res) => {
  const {
    companyId,
    userId,
    isDeleted,
    chartSource,
    chartType,
    field1,
    field2,
    layout,
    chartElements,
  } = req.body;

  try {
    const newEntry = new UserAnalyticsCharts({
      graph: [
        {
          companyId,
          userId,
          isDeleted,
          chartSource,
          chartType,
          field1,
          field2,
          layout,
          chartElements,
        },
      ],
    });

    console.log("in save", newEntry);

    // Save the new graph entry
    await newEntry.save();

    // Prepare additional configuration based on chartType
    let additionalConfig = {};

    if (chartType === "1") {
      // Pie chartType specific configurations
      additionalConfig = {
        pieChart: {
          legend: legend,
          total: total,
          selectPercentage: selectPercentage,
          minimumSlicePercentage: minimumSlicePercentage,
        },
      };
    } else if (chartType === "2") {
      // Bar chartType specific configurations
      additionalConfig = {
        barLineChart: {
          goalLine: goalLine,
          goalValue: goalValue,
          goalLabel: goalLabel,
          showValues: showValues,
          valueToShow: valueToShow,
          showLabel: showLabel,
          label: label,
          showLineAndMarks: showLineAndMarks,
          yShowLabel: yShowLabel,
          yLabel: yLabel,
          yshowLineAndMarks: yshowLineAndMarks,
        },
      };
    }

    // Update the chartElements field in the newEntry
    newEntry.graph[0].chartElements = additionalConfig;
    // Save the updated newEntry with chartElements
    await newEntry.save();
    res.send({ msg: "Data saved successfully" });
  } catch (err) {
    console.error("Error in saving graph data: ", err.message);
    res.status(500).send("Error in saving graph data");
  }
});

router.patch("/updateGraphPositions/:objid/:id", async (req, res) => {
  try {
    const objid = req.params.objid;
    const id = req.params.id; // Extract the graph id
    const updatedPosition = req.body.layout; // Extract the updated position data
    // Fetch the parent object containing multiple graphs using objid
    const graphObject = await CommonSchema.findOne({ objid });
    if (!graphObject) {
      return res.status(404).json({ message: "Parent object not found" });
    }
    // Find the specific graph within the parent object using id
    const graphToUpdate = graphObject.graph.find((graph) => graph._id === id);
    if (!graphToUpdate) {
      return res.status(404).json({ message: "Graph not found" });
    }
    // Update the layout of the graph
    graphToUpdate.layout = updatedPosition;
    // Save the updated parent object
    await graphObject.save();
    res.send({ message: "Graph layout updated successfully" });
  } catch (err) {
    console.error("Error updating graph layout:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/saveGraph", async (req, res) => {
  const data = req.body;
  const latestGraph = await CommonSchema.findOne({});
  console.log(latestGraph);
  const { _id } = latestGraph;
  console.log(latestGraph.graph);
  const graph = [...latestGraph.graph, data];
  const response = await CommonSchema.findByIdAndUpdate(_id, {
    graph,
  });
  res.send({ response });
});

router.get("/getGraph", async (req, res) => {
  try {
    const data = await CommonSchema.find({});
    res.send(data);
  } catch (err) {
    console.error("Error fetching data from MongoDB: " + err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getGraphWithDisplay", async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "barmodels",
          localField: "_id",
          foreignField: "_id",
          as: "results",
        },
      },
      {
        $lookup: {
          from: "displayschemas",
          localField: "_id",
          foreignField: "_id",
          as: "results_two",
        },
      },
    ];
    const data = await CommonSchema.aggregate(pipeline);
    res.send(data);
  } catch (err) {
    console.error("Error fetching data from MongoDB: " + err);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/deleteGraph/:id", async (req, res) => {
  try {
    const graphId = req.body;
    const _id = req.params.id;
    const graphs = await CommonSchema.findOne({ _id: _id });
    console.log(graphs);
    let graph = [];
    for (const item of graphs.graph) {
      if (item._id != graphId.id) {
        graph.push(item);
      }
    }
    const response = await CommonSchema.findByIdAndUpdate(_id, { graph });
    res.send(response);
    console.log(graph);
  } catch (err) {
    console.error("Error deleting graph entry:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/updateGraph/:objid/:id", async (req, res) => {
  try {
    const objid = req.params.objid;
    const id = req.params.id;
    let updatedData = req.body;
    // console.log("updated data", updatedData);
    // updatedData = updatedData.updatedData;
    const graphs = await CommonSchema.findOne({ objid });
    const graph = [];

    for (const item of graphs.graph) {
      let temp = item._id;
      if (temp != id) {
        graph.push(item);
      } else graph.push(updatedData);
    }
    const response = await CommonSchema.findByIdAndUpdate(objid, { graph });
    res.send(response);
    // console.log(graph);
    if (!response) {
      return res.status(404).json({ message: "Document not found" });
    }
  } catch (err) {
    console.error("Error updating document:", err.message);
    res.status(500).json({ message: "Error updating document" });
  }
});

module.exports = router;
