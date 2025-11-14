/*
  Warnings:

  - You are about to drop the column `totalCost` on the `Rental` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Made the column `endDate` on table `Rental` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "startSiteId" INTEGER NOT NULL,
    "endSiteId" INTEGER,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rental_endSiteId_fkey" FOREIGN KEY ("endSiteId") REFERENCES "Site" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rental_startSiteId_fkey" FOREIGN KEY ("startSiteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rental" ("createdAt", "endDate", "endSiteId", "id", "startDate", "startSiteId", "userId", "vehicleId") SELECT "createdAt", "endDate", "endSiteId", "id", "startDate", "startSiteId", "userId", "vehicleId" FROM "Rental";
DROP TABLE "Rental";
ALTER TABLE "new_Rental" RENAME TO "Rental";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
