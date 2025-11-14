import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SiteNotFoundException } from "./exception/siteNotFound.exception";
import { Site } from "generated/prisma";

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  async getSiteById(id: number): Promise<Site> {
    const site = await this.prisma.site.findUnique({ where: { id } });

    if (!site) {
      throw new SiteNotFoundException(id);
    }

    return site;
  }
}
