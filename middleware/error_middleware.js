export const error_middleware = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ValidationError") {
    const validation_errors = Object.values(error.errors).map(
      (validation_error) => validation_error.message,
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation_errors,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${error.path}`,
    });
  }

  if (error.code === 11000) {
    const duplicated_fields = Object.keys(
      error.keyPattern || error.keyValue || {},
    );

    const duplicated_field =
      duplicated_fields.length > 0 ? duplicated_fields.join(", ") : "field";

    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${duplicated_field}`,
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authorization token has expired",
    });
  }

  const status_code =
    Number.isInteger(error.status_code) &&
    error.status_code >= 400 &&
    error.status_code <= 599
      ? error.status_code
      : 500;

  return res.status(status_code).json({
    success: false,
    message: status_code === 500 ? "Internal server error" : error.message,
  });
};
