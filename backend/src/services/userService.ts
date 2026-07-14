import { PrismaClient } from '@prisma/client';
import { log } from '../utils/logger';

const prisma = new PrismaClient();

export const userService = {
  // Get user by ID
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        trialEndsAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Get all users (admin only)
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        trialEndsAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Update user
  async updateUser(id: string, data: { name?: string; email?: string; role?: string; isActive?: boolean }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        trialEndsAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Delete user
  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};