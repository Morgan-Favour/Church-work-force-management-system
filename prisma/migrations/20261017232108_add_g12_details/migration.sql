-- AlterTable
ALTER TABLE "G12" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPerson" TEXT DEFAULT 'LEADER',
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "contactWhatsApp" TEXT,
ADD COLUMN     "hostLocation" TEXT,
ADD COLUMN     "hostName" TEXT,
ADD COLUMN     "leaderName" TEXT;
