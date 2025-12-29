import {Router} from 'express';
import passport from 'passport';
import { authorize } from '../middlewares/authorization.js';

import {
    getToys,
    getToyById,
    createToy,
    updateToy,
    deleteToy
} from '../controller/toys.controller.js';

const router = Router();

router.get('/', getToys);
router.get('/:id', getToyById);
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['admin']),
  createToy
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['admin']),
  updateToy
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['admin']),
  deleteToy
);


export default router;