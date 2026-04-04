const catchAsync = (fn) => {
  return (req, res, next) => {
    // Executes the controller function, and if it fails, passes the error to Express
    fn(req, res, next).catch(next); 
  };
};

export default catchAsync;