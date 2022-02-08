import express, { NextFunction, Request, Response, Router } from 'express';

const db = require('../../database/models/db');

const { authenticateToken } = require('../../middleware/middleware');

const FixedBookingRouter = express.Router();

const FixedBookings = db.FixedBookings;

export default (app: Router) => {
  app.use('/fixedBookings', FixedBookingRouter);

  FixedBookingRouter.get(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await FixedBookings.findAll();
        res.send(data);
      } catch (e: any) {
        next(e);
      }
    }
  );

  //TODO -> move away business logic from here
  FixedBookingRouter.post(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      const { fixedBks } = req.body;
      const errors: any = [];
      try {
        const asyncFn = async () => {
          for (const fixedBook of fixedBks) {
            for (const book of fixedBook.bookings) {
              await FixedBookings.create({
                day: fixedBook.day,
                start: book.start,
                end: book.end,
                localId: book.id,
                email: book.email,
              }).catch((e: any) => {
                errors.push(e);
                return;
              });
            }
          }
        };
        asyncFn();
        if (errors.length > 0) {
          next(errors[0]);
        }
        res.send({ message: 'fixedBookings created!' });
      } catch (e: any) {
        next(e);
      }
    }
  );

  //TODO -> move away business logic from here
  FixedBookingRouter.put(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      const { fixedBks } = req.body;
      try {
        const errors: any = [];
        const mainAsyncFn = () => {
          for (const fixedBook of fixedBks) {
            fixedBook.bookings.forEach((book: any) => {
              FixedBookings.findOne({
                where: { localId: book.id },
              })
                .then((bk: any) => {
                  if (bk) {
                    const asyncFn = async () => {
                      try {
                        bk.set({
                          ...book,
                          day: fixedBook.day,
                          start: book.start,
                          end: book.end,
                          email: book.email,
                        });
                        await bk.save().catch((e: any) => {
                          errors.push(e);
                        });
                      } catch (e) {
                        errors.push(e);
                      }
                    };
                    asyncFn();
                  } else {
                    errors.push('book not found');
                  }
                })
                .catch((e: any) => {
                  errors.push(e);
                });
            });
          }
        };
        mainAsyncFn();
        if (errors.length > 0) {
          res.status(500).send(errors[0]);
        }
        res.send('book updated');
      } catch (e: any) {
        next(e);
      }
    }
  );
};
