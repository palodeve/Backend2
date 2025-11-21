import { Router } from "express";

const router = Router();

router.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    res.render('profile', {user: req.session.user});
});

export default router;
