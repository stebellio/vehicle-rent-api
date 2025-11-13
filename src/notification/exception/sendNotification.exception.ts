import { NotificationType } from "../enum/notificationType.enum";

export class SendNotificationException extends Error {
  constructor(type: NotificationType) {
    super(`Failed to send ${type} notification `);
  }
}
