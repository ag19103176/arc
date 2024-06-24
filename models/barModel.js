const mongoose = require("mongoose");
const CommonSchema = require("./commonSchema");
const Schema = mongoose.Schema;

const barSchema = new Schema(
  {
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
    showLabel:{
      type:Boolean,
      default: false,
    },
    Label:{
      type:String,
      default: null,
    },
    showLineAndMarks:{
      type:String,
      default: null,
    },
    yShowLabel:{
      type:Boolean,
      default: null,
    },
    yLabel:{
      type:String,
      default: null,
    },
    autoAxis:{
      type:Boolean,
      default: null,
    },
    min:{
      type:Number,
      default: null,
    },
    max:{
      type:Number,
      default: null,
    },
    yshowLineAndMarks:{
      type:String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const barModel = mongoose.model("barModel", barSchema);
module.exports = barModel;  