import express from 'express';
import { AuthRoutes } from '../app/module/auth/auth.route';
import { UserRoutes } from '../app/module/user/user.route';
import { categoryRoutes } from '../app/module/category/category.route';
const router = express.Router();

const routes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/category",
        route: categoryRoutes
    }
]

routes.forEach(route => router.use(route.path, route.route))

export default router;