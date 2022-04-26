import { Router } from 'express';

import AuthRoutes from './auth/authRoutes';
import AvailabilityRoutes from './availability/availabilityRoutes';
import BookingRoutes from './booking/bookingRoutes';
import FixedBookingRoutes from './fixedBooking/fixedBookingRoutes';
import HolidayRoutes from './holiday/holidayRoutes';
import PasswordRoutes from './password/passwordRoutes';
import PaymentRoutes from './payment/paymentRoutes';
import UserRoutes from './user/userRoutes';

const RootRoutes = () => {
  const RootRouter = Router();

  AuthRoutes(RootRouter);
  BookingRoutes(RootRouter);
  AvailabilityRoutes(RootRouter);
  UserRoutes(RootRouter);
  PasswordRoutes(RootRouter);
  FixedBookingRoutes(RootRouter);
  HolidayRoutes(RootRouter);
  PaymentRoutes(RootRouter);

  return RootRouter;
};

module.exports = RootRoutes;
