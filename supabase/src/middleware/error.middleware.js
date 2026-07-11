export const errorHandler = (err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred."
        : err.message,
  });
};