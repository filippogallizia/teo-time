export type UserDTO = {
  id: number;
  password: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  resetPasswordToken: string;
};

export type UserInputDTO = {
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
};

export type LoginInputDTO = {
  email: string;
  password: string;
};
