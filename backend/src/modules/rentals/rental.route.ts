import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

// Tenant Routes
router.post("/", auth("TENANT"), rentalController.createRentalRequest);
router.get("/", auth("TENANT"), rentalController.getTenantRentalRequests);



// Shared Route
router.get("/:id", auth("TENANT", "LANDLORD", "ADMIN"), rentalController.getRentalRequestDetails);

export const rentalRoutes = router;
