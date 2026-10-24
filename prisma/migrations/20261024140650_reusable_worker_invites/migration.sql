-- DropIndex
DROP INDEX "PendingWorker_inviteId_key";

-- CreateIndex
CREATE INDEX "PendingWorker_inviteId_idx" ON "PendingWorker"("inviteId");
