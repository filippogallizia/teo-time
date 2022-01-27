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

  public getAvailabilities(body: { start: string; end: string }): Promise<any> {
    const { start, end } = body;
    const bodyToSend = { TimeRangeType: [{ start, end }] };

    return HttpService.post(`/retrieveAvailability`, {
      ...bodyToSend,
    });
  }
}

export default new BookingPageApi();
