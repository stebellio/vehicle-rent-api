import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ConfigService } from "@nestjs/config";
import { INotificationStrategy } from "./strategy/notificationStrategy.interface";
import { LogNotificationStrategy } from "./strategy/logNotification.strategy";
import { EmailNotificationStrategy } from "./strategy/emailNotification.strategy";

@Module({
  providers: [
    LogNotificationStrategy,
    EmailNotificationStrategy,
    {
      provide: NotificationService,
      useFactory: (
        logNotificationStrategy: LogNotificationStrategy,
        emailNotificationStrategy: EmailNotificationStrategy,
        configService: ConfigService,
      ) => {
        const configNotificationStrategy: "log" | "email" = configService.get(
          "NOTIFICATION_STRATEGY",
          "log",
        );
        let strategy: INotificationStrategy;

        switch (configNotificationStrategy) {
          case "email":
            strategy = emailNotificationStrategy;
            break;
          case "log":
            strategy = logNotificationStrategy;
            break;
        }

        return new NotificationService(strategy);
      },
      inject: [
        LogNotificationStrategy,
        EmailNotificationStrategy,
        ConfigService,
      ],
    },
  ],
})
export class NotificationModule {}
