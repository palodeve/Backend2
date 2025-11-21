 import jwt from 'jsonwebtoken';

 export const isAuth = (req, res, next) => {
    const token = req.signedCookies.currentUser;

    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
}
export default isAuth;