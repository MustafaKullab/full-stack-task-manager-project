const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  content: {
    type: String,
    required: [true, "This field is required"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
