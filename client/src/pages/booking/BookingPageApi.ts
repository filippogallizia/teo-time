import HttpService from '../../services/HttpService';

class BookingPageApi {
  public createBooking(body: {
    start: string;
    end: string;
    isHoliday?: boolean;
    localId?: number;
  }): Promise<any> {
    const { start, end, isHoliday, localId } = body;
    return HttpService.post(`/bookings`, {
      start,
      end,
      isHoliday,
      localId,
    });
  }

  public getAvailabilities(body: {
    start: string;
    end: string;
    zoneName: string;
  }): Promise<any> {
    const { start, end, zoneName } = body;

    return HttpService.get(
      `/availability/dynamic?start=${start}&end=${end}&zoneName=${zoneName}`
    );
  }
}

export default new BookingPageApi();
