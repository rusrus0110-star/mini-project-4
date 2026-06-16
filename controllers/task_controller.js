import Task from "../models/task_model.js";

const allowed_statuses = ["pending", "in progress", "completed"];

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

    const normalized_status =
      status !== undefined ? status.trim().toLowerCase() : "pending";

    if (!allowed_statuses.includes(normalized_status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be pending, in progress or completed",
      });
    }

    const task = await Task.create({
      title: normalized_title,
      description: typeof description === "string" ? description.trim() : "",
      status: normalized_status,
      user: req.user._id,
    });

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

export const get_tasks = async (req, res, next) => {
  try {
    const {
      status,
      from_date,
      to_date,
      sort = "newest",
      page = "1",
      limit = "10",
    } = req.query;

    const filter = {
      user: req.user._id,
    };

    if (status !== undefined) {
      if (typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status must be a string",
        });
      }

      const normalized_status = status.trim().toLowerCase();

      if (!allowed_statuses.includes(normalized_status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be pending, in progress or completed",
        });
      }

      filter.status = normalized_status;
    }

    if (from_date !== undefined || to_date !== undefined) {
      filter.createdAt = {};
    }

    if (from_date !== undefined) {
      const parsed_from_date = new Date(from_date);

      if (Number.isNaN(parsed_from_date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "from_date must be a valid date",
        });
      }

      filter.createdAt.$gte = parsed_from_date;
    }

    if (to_date !== undefined) {
      const parsed_to_date = new Date(to_date);

      if (Number.isNaN(parsed_to_date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "to_date must be a valid date",
        });
      }

      parsed_to_date.setUTCHours(23, 59, 59, 999);

      filter.createdAt.$lte = parsed_to_date;
    }

    const page_number = Number.parseInt(page, 10);
    const limit_number = Number.parseInt(limit, 10);

    if (!Number.isInteger(page_number) || page_number < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (
      !Number.isInteger(limit_number) ||
      limit_number < 1 ||
      limit_number > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be an integer between 1 and 100",
      });
    }

    let sort_options;

    switch (sort) {
      case "oldest":
        sort_options = { createdAt: 1 };
        break;

      case "title_asc":
        sort_options = { title: 1 };
        break;

      case "title_desc":
        sort_options = { title: -1 };
        break;

      case "newest":
      default:
        sort_options = { createdAt: -1 };
        break;
    }

    const skip = (page_number - 1) * limit_number;

    const [tasks, total_tasks] = await Promise.all([
      Task.find(filter)
        .sort(sort_options)
        .skip(skip)
        .limit(limit_number)
        .lean(),

      Task.countDocuments(filter),
    ]);

    const total_pages = Math.ceil(total_tasks / limit_number);

    return res.status(200).json({
      success: true,
      results: tasks.length,
      pagination: {
        current_page: page_number,
        total_pages,
        total_tasks,
        limit: limit_number,
      },
      data: {
        tasks: tasks.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          user: task.user,
          created_at: task.createdAt,
          updated_at: task.updatedAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
