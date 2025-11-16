import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import Mocked = jest.Mocked;
import { PrismaService } from "../prisma/prisma.service";
import { UserNotFoundException } from "./exception/userNotFound.exception";
import { User } from "generated/prisma";

describe("UserService", () => {
  let service: UserService;

  let prismaService: {
    user: Mocked<PrismaService["user"]>;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getUserWithActiveRental", () => {
    it("should throw if user is not found", () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      expect(service.getUserWithActiveRental(1)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it("should retrieve user", () => {
      const user = { id: 1, name: "test" } as User;
      prismaService.user.findUnique.mockResolvedValue(user);
      expect(service.getUserWithActiveRental(1)).resolves.toEqual(user);
    });
  });
});
