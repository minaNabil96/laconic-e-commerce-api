const globalErrorHandler = function (err, req, res, next) {
  // set locals, only providing error in development
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get("env") === "development" ? err : {};
  // handel catched error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.errmessage = err.message;
  // render the error page
  res.status(err.statusCode);
  res.json({
    error: err,
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = globalErrorHandler;
