const AppError = require("../utils/appErorr");

const globalErrorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') err = handleJwtExpired();
    sendErrorForProd(err, res);
  }
};

const handleJsonWebTokenError = () => {
  return new AppError("Invalid JSON Web Token, please log in again", 401);
};

const handleJwtExpired = () =>{
  return new AppError('Expired token, please login again..', 401);
}
  

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational ? err.message : "Something went wrong!",
  });
};

module.exports = globalErrorHandling;
