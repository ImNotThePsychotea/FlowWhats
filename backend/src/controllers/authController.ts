import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';
import { authService } from '../services/authService';

export const authController = {
  // Register a new user
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      log.error('Error in register controller:', error);
      next(error);
    }
  },

  // Login user
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      log.error('Error in login controller:', error);
      next(error);
    }
  },

  // Refresh access token
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }
      const result = await authService.refreshToken(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      log.error('Error in refreshToken controller:', error);
      next(error);
    }
  },

  // Logout user (invalidate refresh token on client side, but we can also add to a blacklist if needed)
  async logout(req: Request, res: Response, next: NextFunction) {
    // In a more advanced implementation, we would add the refresh token to a blacklist
    // For now, we just return success and let the client handle token removal
    try {
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      log.error('Error in logout controller:', error);
      next(error);
    }
  },

  // Get current user profile
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // The user is attached to req by the authenticateToken middleware
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const user = await authService.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      log.error('Error in getProfile controller:', error);
      next(error);
    }
  },

  // Update user profile
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const { name, email } = req.body;
      const user = await authService.updateUser(userId, { name, email });
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      log.error('Error in updateProfile controller:', error);
      next(error);
    }
  },
};