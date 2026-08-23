import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const router = Router();

router.get(
  "/requests",
  auth("LANDLORD"),
  rentalController.getLandlordRentalRequests
);

router.patch(
  "/requests/:id",
  auth("LANDLORD"),
  rentalController.updateRentalRequestStatus
);

export const landlordRoutes = router;