import { Injectable, Logger } from "@nestjs/common";
import type { INotificationStrategy } from "./strategy/notificationStrategy.interface";
import { Rental, Site, User, Vehicle } from "generated/prisma";
import { DateHelper } from "../common/utils/helpers/date.helper";
import { SendNotificationException } from "./exception/sendNotification.exception";
import { NotificationType } from "./enum/notificationType.enum";

export interface INotificationOptions {
  recipient: User;
  title?: string;
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly strategy: INotificationStrategy<INotificationOptions>,
  ) {}

  async sendRentalConfirmNotification(
    receiver: User,
    vehicle: Vehicle,
    rental: Rental,
    site: Site,
  ) {
    const options = {
      recipient: receiver,
      title: `Rental Confirmation`,
    };

    try {
      await this.strategy.sendNotification(
        `Hello ${receiver.name},
       your rental of vehicle ${vehicle.name} in ${site.name} has been confirmed
       
       The amount to be paid is ${rental.amount.toNumber()}.
       You have to return the vehicle within the day ${DateHelper.formatDate(rental.endDate)}
       `,
        options,
      );
    } catch (e) {
      Logger.error("NotificationService", "sendRentalConfirmNotification", e);
      throw new SendNotificationException(NotificationType.RENTAL_START, e);
    }
  }

  async sendRentalCompleteNotification(
    receiver: User,
    vehicle: Vehicle,
    rental: Rental,
    site: Site,
  ) {
    const options = {
      recipient: receiver,
      title: `Rental Complete`,
    };

    try {
      await this.strategy.sendNotification(
        `Hello ${receiver.name},
       your rental of vehicle ${vehicle.name} has been completed in ${site.name}.

       The total amount paid was ${rental.amount.toNumber()}.
       Rental completion date: ${DateHelper.formatDate(rental.completedAt || new Date())}
       `,
        options,
      );
    } catch (e) {
      Logger.error("NotificationService", "sendRentalCompleteNotification", e);
      throw new SendNotificationException(NotificationType.RENTAL_END, e);
    }
  }
}
