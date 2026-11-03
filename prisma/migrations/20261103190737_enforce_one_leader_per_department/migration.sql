/*
  Warnings:

  - A unique constraint covering the columns `[departmentId]` on the table `LeaderDepartment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeaderDepartment_departmentId_key" ON "LeaderDepartment"("departmentId");
