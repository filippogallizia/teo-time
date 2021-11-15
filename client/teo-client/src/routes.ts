class Routes {
  HOMEPAGE_LOGIN(HOMEPAGE_LOGIN: any) {
    throw new Error('Method not implemented.');
  }
  public ROOT = '/';
  public ERROR = '/error';
  public LOGIN = '/login';
  public LOGIN_FORGOT_PASSWORD = '/forgotPassword';
  public SIGNUP = '/signup';
  public RESET_PASSWORD = '/resetPassword';
  public USER = '/homepage/user';
  public HOMEPAGE = '/homepage';
  public CONFIRM_PAGE = '/homepage/confirm';
  public ADMIN = '/homepage/admin';
  public HOMEPAGE_BOOKING = '/homepage/booking';
  public HOMEPAGE_SUCCESS = '/homepage/success';
  public ADMIN_BOOKING_MANAGER = '/homepage/admin/bookingManager';
  public ADMIN_AVAL_MANAGER = '/homepage/admin/avalManager';
  public ADMIN_HOLIDAY_MANAGER = '/homepage/admin/holidayManager';
  public ADMIN_USERS_TABLE = '/homepage/admin/usersTable';
}

export default new Routes();
