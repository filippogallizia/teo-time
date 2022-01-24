import { UserType } from '../../../../types/Types';

export class UserService {
  public id?: number;
  public password?: any;
  public email?: string;
  public name?: string;
  public phoneNumber?: number;
  public role?: string;
  public resetPasswordToken?: string;

  constructor(public user?: UserType) {
    this.id = user?.id ?? 0;
    this.password = user?.password ?? '';
    this.email = user?.email ?? '';
    this.name = user?.name ?? '';
    this.phoneNumber = user?.phoneNumber ?? 0;
    this.role = user?.role ?? '';
    this.resetPasswordToken = user?.resetPasswordToken ?? '';
  }
}

export default UserService;
