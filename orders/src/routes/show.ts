import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@public-gittix/common';
import { Order } from '../models/order';
import { body } from 'express-validator';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
