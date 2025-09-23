const { AppError } = require("./app_error");

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch((error) => {
            // If it's already an AppError, pass it through
            if (error instanceof AppError) {
                return next(error);
            }
            
            // Otherwise, wrap it in an AppError
            const errorMessage = error.message || 'Internal Server Error';
            next(new AppError(errorMessage, 500));
        });
};

module.exports = asyncHandler;
