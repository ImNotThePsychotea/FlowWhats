import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';
import { userService } from '../services/userService';

export const userController = {
  // Get all users (admin only)
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // In a real app, we would check the user's role here
      // For now, we'll assume the user is admin if they have the role ADMIN
      const user = req.user;
      if (user?.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.',
        });
      }

      const users = await userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      log.error('Error in getAllUsers controller:', error);
      next(error);
    }
  },

  // Delete user (admin only)
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (user?.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.',
        });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      await userService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      log.error('Error in deleteUser controller:', error);
      next(error);
    }
  },
};