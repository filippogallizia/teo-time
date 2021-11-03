class Routes {
  HOMEPAGE_LOGIN(HOMEPAGE_LOGIN: any) {
    throw new Error('Method not implemented.');
  }
  public ROOT = '/';
  public ERROR = '/error';
  public LOGIN = '/login';
  public LOGIN_FORGOT_PASSWORD = '/login/forgotPassword';
  public SIGNUP = '/signup';
  public RESET_PASSWORD = '/resetPassword';
  public USER = '/homepage/user';
  public HOMEPAGE = '/homepage';
  public CONFIRM_PAGE = '/homepage/confirm';
  public ADMIN = '/homepage/admin';
  public HOMEPAGE_BOOKING = '/homepage/booking';
  public HOMEPAGE_SUCCESS = '/homepage/success';
}

export default new Routes();
