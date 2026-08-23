import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { adminRoutes } from "./modules/admin/admin.route";
import { reviewRoutes } from "./modules/reviews/review.route";
import { paymentRoutes } from "./modules/payments/payment.route";
import { landlordRoutes } from "./modules/rentals/landlord.route";
import { landlordPropertyRoutes } from "./modules/properties/landlordProperty.route";
import { rentalRoutes } from "./modules/rentals/rental.route";
import { propertyRoutes } from "./modules/properties/property.route";
import { categoryRoutes } from "./modules/categories/category.route";
import { authRoutes } from "./modules/auth/auth.route";
import { paymentController } from "./modules/payments/payment.controller";


const app: Application = express();

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("My RentNest Server is running successfully");
});

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/rentals", rentalRoutes);

app.use("/api/landlord/properties", landlordPropertyRoutes);
app.use("/api/landlord", landlordRoutes);


app.use("/api/payments", paymentRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/admin", adminRoutes);

app.use(globalErrorHandler);

export default app;