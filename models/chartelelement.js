const mongoose = require("mongoose");

// Define subschema for pie chart configurations
const PieChartSchema = new mongoose.Schema({
  legend: {
    type: Boolean,
    required: true,
  },
  total: {
    type: Boolean,
    required: true,
  },
  selectPercentage: {
    type: Number,
    required: true,
  },
  minSlicePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

// Define subschema for bar and line chart configurations
const BarLineChartSchema = new mongoose.Schema({
  goalLine: {
    type: Boolean,
    default: false,
  },
  goalValue: {
    type: Number,
    default: null,
  },
  goalLabel: {
    type: String,
    default: null,
  },
  showValues: {
    type: Boolean,
    default: false,
  },
  valueToShow: {
    type: String,
    default: null,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: null,
  },
  showLineAndMarks: {
    type: String,
    default: null,
  },
  yShowLabel: {
    type: Boolean,
    default: null,
  },
  yLabel: {
    type: String,
    default: null,
  },
  autoyAxis: {
    type: Boolean,
    default: null,
  },
  min: {
    type: Number,
    default: null,
  },
  max: {
    type: Number,
    default: null,
  },
  yshowLineAndMarks: {
    type: String,
    default: null,
  },
});

// Main ChartElement schema using the sub-schemas
const ChartElementSchema = new mongoose.Schema({
  pieChart: PieChartSchema,
  barLineChart: BarLineChartSchema,
});

// Define the UserAnalyticsCharts schema
const UserAnalyticsChartsSchema = new mongoose.Schema({
  graph: [
    {
      companyId: {
        type: Number,
        required: true,
      },
      userId: {
        type: Number,
        required: true,
      },
      isDeleted: {
        type: Boolean,
        required: true,
      },
      chartSource: {
        // The source of the data for the chart-[ ticket, invoice, estimate]
        type: String,
        required: true,
      },
      chartType: {
        // The type of chart- [pie, bar, line]
        type: String,
        required: true,
      },
      field1: {
        // For pie charts: dimension field
        // For bar/line charts: x-axis field
        type: String,
        required: true,
      },
      field2: {
        // For pie charts: measure field
        // For bar/line charts: y-axis field
        type: String,
        required: true,
      },
      layout: {
        // Layout configuration for the chart, specifying its position and size
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
        w: {
          type: Number,
          default: 0,
        },
        h: {
          type: Number,
          default: 0,
        },
      },
      chartElements: {
        type: ChartElementSchema,
        required: true,
      },
    },
  ],
});

const UserAnalyticsCharts = mongoose.model(
  "UserAnalyticsCharts",
  UserAnalyticsChartsSchema
);
module.exports = UserAnalyticsCharts;
