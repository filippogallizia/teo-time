import HttpService from '../../services/HttpService';

class BookingPageApi {
  public createBooking(body: {
    start: string;
    end: string;
    isHoliday?: boolean;
    localId?: number;
  }): Promise<any> {
    const { start, end, isHoliday, localId } = body;
    return HttpService.post(`/createBooking`, {
      start,
      end,
      isHoliday,
      localId,
    });
  }
}

export default new BookingPageApi();
