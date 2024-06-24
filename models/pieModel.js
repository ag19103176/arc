const mongoose = require("mongoose");
const CommonSchema = require("./commonSchema");
const Schema = mongoose.Schema;

const pieSchema = new Schema({
  legend: {
    type: Boolean,
    required: true,
  },
  total: {
    type: Boolean,
    required: true,
  },
  minSlicePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  commonSchemaRef: {
    type: Schema.Types.ObjectId,
    ref: CommonSchema,
    required: true,
  },
});

const pieModel = mongoose.model("pieModel", pieSchema);
module.exports = pieModel;