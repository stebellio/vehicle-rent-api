import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserNotFoundException } from "./exception/userNotFound.exception";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserWithActiveRental(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { rentals: { where: { completedAt: null } } },
    });

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }
}
