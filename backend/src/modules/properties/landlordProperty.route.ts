import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { propertyController } from "./property.controller";

const router = Router();

router.use(auth("LANDLORD"));

router.get("/", propertyController.getLandlordProperties);
router.post("/", propertyController.createProperty);
router.put("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);

export const landlordPropertyRoutes = router;