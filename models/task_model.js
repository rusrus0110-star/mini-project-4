import mongoose from "mongoose";

const task_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Task title must contain at least 2 characters"],
      maxlength: [100, "Task title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Task description cannot exceed 1000 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "in progress", "completed"],
        message: "Status must be pending, in progress or completed",
      },
      default: "pending",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task owner is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

task_schema.index({
  user: 1,
  status: 1,
  createdAt: -1,
});

const Task = mongoose.model("Task", task_schema);

export default Task;
