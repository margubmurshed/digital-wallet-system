import { Router } from "express";

export const router = Router();

interface IModuleRoute {
    path: string;
    router: Router;
}

const moduleRoutes: IModuleRoute[] = [];

moduleRoutes.forEach(route => {
    router.use(route.path, route.router)
})