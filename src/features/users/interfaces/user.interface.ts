export interface IUser {
  id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword?(candidatePassword: string): Promise<boolean>;
}
