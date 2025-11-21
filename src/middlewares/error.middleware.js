const errorMW = (err, _req, res, _next) => {
    console.error(err);
    const code=
        err.first_name ||
        err.last_name ||
        err.email ||
        err.password ||
        err.age||
        err.cart=== 'ValidationError' ? 422:
        err.code === 11000 ? 409 : 500;
    res.status(code).json({ message: err.message });


};

export default errorMW;




//||