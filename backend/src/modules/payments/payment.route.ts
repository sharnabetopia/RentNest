import { Router } from "express";
import express from "express";

import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();


router.post(
  "/create",
  auth("TENANT"),
  paymentController.createPayment
);


router.get(
  "/",
  auth("TENANT"),
  paymentController.getUserPaymentHistory
);

router.get(
  "/:id",
  auth("TENANT"),
  paymentController.getPaymentDetails
);

export const paymentRoutes = router;