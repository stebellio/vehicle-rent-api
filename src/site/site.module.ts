import { Module } from "@nestjs/common";
import { SiteService } from "./site.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [SiteService],
})
export class SiteModule {}
