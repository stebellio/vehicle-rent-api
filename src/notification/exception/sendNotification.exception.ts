import { NotificationType } from "../enum/notificationType.enum";

export class SendNotificationException extends Error {
  constructor(type: NotificationType, data?: unknown) {
    super(`Failed to send ${type} notification`, {
      cause: data,
    });
  }
}
