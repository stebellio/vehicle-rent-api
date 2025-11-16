import { Test, TestingModule } from "@nestjs/testing";
import { SiteService } from "./site.service";
import Mocked = jest.Mocked;
import { PrismaService } from "../prisma/prisma.service";
import { mock } from "jest-mock-extended";
import { SiteNotFoundException } from "./exception/siteNotFound.exception";

describe("SiteService", () => {
  let service: SiteService;
  let prismaService: {
    site: Mocked<PrismaService["site"]>;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteService,
        {
          provide: PrismaService,
          useValue: mock<PrismaService>({
            site: {
              findUnique: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<SiteService>(SiteService);
    prismaService = module.get(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllSites", () => {
    it("should throw if site is not found", async () => {
      prismaService.site.findUnique.mockResolvedValue(null);

      await expect(service.getSiteById(1)).rejects.toThrow(
        SiteNotFoundException,
      );
    });

    it("should retrieve site", () => {
      const site = { id: 1, name: "test" };
      prismaService.site.findUnique.mockResolvedValue(site);
      expect(service.getSiteById(1)).resolves.toEqual(site);
    });
  });
});
