import Task from "../models/task_model.js";

export const create_task = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    if (typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Task title must be a string",
      });
    }

    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Task description must be a string",
      });
    }

    if (status !== undefined && typeof status !== "string") {
      return res.status(400).json({
        success: false,
        message: "Task status must be a string",
      });
    }

    const normalized_title = title.trim();

    if (!normalized_title) {
      return res.status(400).json({
        success: false,
        message: "Task title cannot be empty",
      });
    }

    const task_data = {
      title: normalized_title,
      description: typeof description === "string" ? description.trim() : "",
      user: req.user._id,
    };

    if (status !== undefined) {
      task_data.status = status.trim().toLowerCase();
    }

    const task = await Task.create(task_data);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: {
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          user: task.user,
          created_at: task.createdAt,
          updated_at: task.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
