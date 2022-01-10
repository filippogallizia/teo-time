import { Op } from 'sequelize';

import { BookingDTO } from '../../interfaces/BookingDTO';
import { UserDTO } from '../../interfaces/UserDTO';
import { BookingModel } from '../models/Bookings.model';

export type RecordType = UserDTO | BookingDTO;

class QueryDates {
  public inBtwStartAndEnd(start: string, end: string) {
    return {
      start: {
        [Op.gte]: start,
      },
      end: {
        [Op.lte]: end,
      },
    };
  }
  public smallerStartInBtwEnd(start: string, end: string) {
    return {
      start: {
        [Op.lte]: start,
      },
      end: {
        [Op.between]: [start, end],
      },
    };
  }
  public smallerStartAndBiggerEnd(start: string, end: string) {
    return {
      start: {
        ['Op.lte']: start,
      },
      end: {
        [Op.gte]: end,
      },
    };
  }
  public inBtwStartAndSmallerEnd(start: string, end: string) {
    return {
      start: {
        [Op.between]: [start, end],
      },
      end: {
        [Op.gte]: end,
      },
    };
  }
}

class DatabaseService {
  public queryDates = new QueryDates();

  public findOne(
    searchParam: Record<string, unknown>,
    Model: any
  ): Promise<RecordType> {
    return Model.findOne({
      where: searchParam,
    });
  }

  public findAll(
    searchParam: Record<string, unknown>,
    Model: any
  ): Promise<RecordType[]> {
    return Model.findAll({
      where: { ...searchParam },
    });
  }

  public create(
    params: Record<string, unknown>,
    Model: any
  ): Promise<RecordType> {
    return Model.create(params);
  }

  public associate(
    record: BookingModel,
    recordToBeAssigned: Record<string, unknown>,
    setFn: () => void
  ): Promise<RecordType> {
    return record.setFn(recordToBeAssigned);
  }
}

export default new DatabaseService();
