import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/users", auth("ADMIN"), adminController.getAllUsers);
router.patch("/users/:id", auth("ADMIN"), adminController.updateUserStatus);
router.get("/properties", auth("ADMIN"), adminController.getAllProperties);
router.get("/rentals", auth("ADMIN"), adminController.getAllRentals);

export const adminRoutes = router;
