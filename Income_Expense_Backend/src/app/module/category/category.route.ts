import express from 'express';
import { categoryController } from './category.controller';
import auth from '../../middlewares/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = express.Router();

router.post('/', auth(Role.USER, Role.ADMIN), categoryController.createCategory)
router.get('/', auth(Role.USER, Role.ADMIN), categoryController.getCategory)

export const categoryRoutes = router;