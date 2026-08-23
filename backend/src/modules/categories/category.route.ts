import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth("ADMIN"), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);

export const categoryRoutes = router;
