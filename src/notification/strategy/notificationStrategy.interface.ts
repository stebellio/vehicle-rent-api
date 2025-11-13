export interface INotificationStrategy<T> {
  sendNotification(message: string, options: T): Promise<void>;
}
