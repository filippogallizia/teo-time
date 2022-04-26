import { Request } from 'express';
import { DateTime } from 'luxon';
import { RRule, RRuleSet, rrulestr } from 'rrule';

import {
  deleteEvent,
  getEvents,
  updateEvent,
} from '../../googleApi/GoogleCalendarService';
import { setTimeToDate } from '../../utils';
import { ErrorService } from '../errorService/ErrorService';
import { FixedBookingDTO } from './interfaces';

const db = require('../../database/models/db');

export type RecordType = FixedBookingDTO;

//TODO -> IMPLEMENT VALIDATION FOR NOT HAVING DOUBLE BOOKING SAME HOUR

class FixedBookingService {
  fixedBookingsModel = db.FixedBookings;

  public async findOne(req: Request | string | number): Promise<any> {
    const id =
      typeof req == 'string' || typeof req === 'number' ? req : req.body.id;
    try {
      return await this.fixedBookingsModel.findOne({ where: { id } });
    } catch (error) {
      throw ErrorService.badRequest('Booking not found');
    }
  }

  public async create(req: FixedBookingDTO): Promise<any> {
    const {
      start,
      end,
      day,
      email,
      exceptionDate,
      calendarEventId,
    }: FixedBookingDTO = req;
    try {
      return await this.fixedBookingsModel.create({
        day,
        email,
        end,
        start,
        exceptionDate,
        calendarEventId,
      });
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }

  public async findAll(param?: {
    include?: Record<string, unknown>;
    where?: Record<string, unknown>;
    order?: any[];
  }): Promise<FixedBookingDTO[]> {
    try {
      const parameters = {
        include: param?.include,
        where: param?.where,
        order: param?.order,
      };

      const optionalParameters =
        Object.keys(parameters).length > 0 ? parameters : undefined;

      return await this.fixedBookingsModel.findAll(optionalParameters);
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }

  public async findAllSorted(
    sortRule: Record<string, unknown>
  ): Promise<FixedBookingDTO[]> {
    try {
      return await this.fixedBookingsModel.findAll(sortRule);
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }

  public async destroy(req: Request): Promise<0 | 1> {
    const id = req.query.id;

    try {
      // before to delete the booking we need to get the calendarEventId
      const fixedBks = await this.findOne(id as string);

      // delete the booking
      const response = await this.fixedBookingsModel.destroy({ where: { id } });

      // after deleteting the booking, we can delete the google event.
      fixedBks.calendarEventId && (await deleteEvent(fixedBks.calendarEventId));

      // return the booking deleted
      return response;
    } catch (error) {
      throw ErrorService.badRequest('Booking not found');
    }
  }

  public async update(req: Request | Partial<FixedBookingDTO>): Promise<0 | 1> {
    const {
      start,
      end,
      day,
      email,
      id,
      exceptionDate,
    }: Partial<FixedBookingDTO> = (req as Request).body
      ? (req as Request).body.fixedBks
      : (req as Partial<FixedBookingDTO>);

    try {
      const fixedBkg = id && (await this.findOne(id));

      const response = await this.fixedBookingsModel.update(
        {
          start,
          end,
          day,
          email,
          exceptionDate,
        },
        {
          where: {
            id,
          },
        }
      );

      // update calendar event

      const event = await getEvents(fixedBkg.calendarEventId);

      const eventStart = event[0].start.dateTime;
      const eventEnd = event[0].end.dateTime;

      const r = exceptionDate && start && setTimeToDate(exceptionDate, start);

      const prova = r && DateTime.fromISO(r).toUTC().toJSDate();

      const rruleSet = new RRuleSet();

      // Add a rrule to rruleSet
      prova &&
        rruleSet.rrule(
          new RRule({
            freq: RRule.MONTHLY,
            count: 5,
            dtstart: prova,
          })
        );

      const updatedStart = start && setTimeToDate(eventStart, start);
      const updatedEnd = end && setTimeToDate(eventEnd, end);

      prova && rruleSet.exdate(prova);

      const finale = rruleSet.valueOf();

      const updatedEvent = {
        summary: email,
        description: `${process.env.EVENT_DESCRIPTION} con ${email}`,
        start: {
          dateTime: updatedStart,
        },
        end: {
          dateTime: updatedEnd,
        },
        recurrence: ['RRULE:FREQ=WEEKLY;COUNT=5;BYDAY=FR', `${finale[2]}`],
      };

      await updateEvent(fixedBkg.calendarEventId, updatedEvent);

      return response;
    } catch (error) {
      throw ErrorService.badRequest('Booking not found');
    }
  }
}

export default new FixedBookingService();
