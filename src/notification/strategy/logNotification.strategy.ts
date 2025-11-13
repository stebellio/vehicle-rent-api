import { INotificationStrategy } from "./notificationStrategy.interface";
import { Injectable, Logger } from "@nestjs/common";
import { INotificationOptions } from "../notification.service";

interface ILogOptions extends INotificationOptions {}

@Injectable()
export class LogNotificationStrategy
  implements INotificationStrategy<ILogOptions>
{
  sendNotification(message: string, options: ILogOptions): Promise<void> {
    Logger.log(message);
  }
}
