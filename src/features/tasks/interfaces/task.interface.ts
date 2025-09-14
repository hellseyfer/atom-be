export interface ITask {
  id?: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  completed: boolean;
  userId: string;
}
