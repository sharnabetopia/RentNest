import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Stripe from "stripe";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { PaymentStatus, RentalStatus } from "../../../prisma/generated/prisma/enums";


export const webhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).send("Missing stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const paymentId = session.metadata?.paymentId;

      if (!paymentId) break;

      const payment = await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      });

      if (!payment) break;

      if (payment.status === PaymentStatus.COMPLETED) break;

      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: PaymentStatus.COMPLETED,
          transactionId: session.payment_intent as string,
          paidAt: new Date(),
        },
      });

      await prisma.rentalRequest.update({
        where: {
          id: payment.rentalRequestId,
        },
        data: {
          status: RentalStatus.COMPLETED,
        },
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      await prisma.payment.updateMany({
        where: {
          transactionId: paymentIntent.id,
        },
        data: {
          status: PaymentStatus.FAILED,
        },
      });

      break;
    }
  }

  res.status(200).json({
    received: true,
  });
});

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.createPayment(
      req.user.id,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Stripe checkout session created successfully.",
      data: result,
    });
  }
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.confirmPayment();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed.",
      data: result,
    });
  }
);

const getUserPaymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.getUserPaymentHistory(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully.",
      data: result,
    });
  }
);

const getPaymentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.getPaymentDetails(
      req.params.id as string,
      req.user.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully.",
      data: result,
    });
  }
);

export const paymentController = {
  webhook,
  createPayment,
  confirmPayment,
  getUserPaymentHistory,
  getPaymentDetails,
};