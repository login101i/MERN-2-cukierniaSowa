import ErrorHandler from '../utils/ErrorHandler';


export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        console.log(err);

        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message;

        // Wrong Mongoose Object ID Error
        if (err.name === 'CastError') {
            const message = `Nie znaleziono źródła  tzn takiego adresu http ... np, w mongodB wprowadziłeś nieparwidłowy adres, pewnie jest literówka.. Problem czy też tę literówkę znajdziesz tutaj ------->: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose duplicate key errors np kiedy będziemy chcieli zarejestrować użytkownika o takim samym adresie email. A w modelu mamy to, że email musi być unikalny.
        if (err.code === 11000) {
            const message = `Zduplikowany ${Object.keys(err.keyValue)}. Nie można powtarzać koleżko :) `
            error = new ErrorHandler(message, 400)
        }

        // Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token wygasł lub jest nieprawidłowy (pewnie to drugie). Spróbuj ponownie'
            error = new ErrorHandler(message, 400)
        }

        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token wygasł. Spróbuj ponownie'
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Wewnętrzny błąd serwera :)'
        })
    }
}