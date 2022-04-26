import HttpService from '../../../services/HttpService';

class UserPageApi {
  public retriveUserBooking(): Promise<any> {
    return HttpService.get(`/users/bookings`);
  }

  public deleteBooking(body: { start: string; end: string }): Promise<any> {
    const { start, end } = body;
    return HttpService.delete(`/bookings`, {
      data: {
        start,
        end,
      },
    });
  }
}

export default new UserPageApi();
