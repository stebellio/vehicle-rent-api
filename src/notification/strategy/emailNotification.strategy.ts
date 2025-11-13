import { INotificationStrategy } from "./notificationStrategy.interface";
import { Injectable } from "@nestjs/common";
import { INotificationOptions } from "../notification.service";

interface IEmailOptions extends INotificationOptions {
  cc: string[];
  ccn: string[];
}

@Injectable()
export class EmailNotificationStrategy
  implements INotificationStrategy<IEmailOptions>
{
  sendNotification(message: string, options: IEmailOptions): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
