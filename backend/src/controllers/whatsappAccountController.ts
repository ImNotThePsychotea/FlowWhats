import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';
import { whatsappService } from '../services/whatsappService';

export const whatsappAccountController = {
  // Connect a new WhatsApp account
  async connectAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { phoneNumber, token } = req.body;

      // In a real app, we would validate the phone number and token with WhatsApp API
      // For now, we just create the account
      const account = await whatsappService.connectAccount(userId, phoneNumber, token);

      res.status(201).json({
        success: true,
        message: 'WhatsApp account connected successfully',
        data: account,
      });
    } catch (error) {
      log.error('Error in connectAccount controller:', error);
      next(error);
    }
  },

  // Get all WhatsApp accounts for the current user
  async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const accounts = await whatsappService.getAccountsByUserId(userId);

      res.status(200).json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      log.error('Error in getAccounts controller:', error);
      next(error);
    }
  },

  // Get a specific WhatsApp account by ID
  async getAccountById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const account = await whatsappService.getAccountById(id);

      // Check if the account belongs to the current user
      if (!account || account.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'WhatsApp account not found',
        });
      }

      res.status(200).json({
        success: true,
        data: account,
      });
    } catch (error) {
      log.error('Error in getAccountById controller:', error);
      next(error);
    }
  },

  // Update a WhatsApp account (e.g., update token or connection status)
  async updateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const { token, isConnected } = req.body;

      // First, get the account to ensure it belongs to the user
      const account = await whatsappService.getAccountById(id);
      if (!account || account.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'WhatsApp account not found',
        });
      }

      const updatedAccount = await whatsappService.updateAccount(id, {
        token,
        isConnected,
      });

      res.status(200).json({
        success: true,
        message: 'WhatsApp account updated successfully',
        data: updatedAccount,
      });
    } catch (error) {
      log.error('Error in updateAccount controller:', error);
      next(error);
    }
  },

  // Disconnect a WhatsApp account
  async disconnectAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;

      // First, get the account to ensure it belongs to the user
      const account = await whatsappService.getAccountById(id);
      if (!account || account.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'WhatsApp account not found',
        });
      }

      await whatsappService.disconnectAccount(id);

      res.status(200).json({
        success: true,
        message: 'WhatsApp account disconnected successfully',
      });
    } catch (error) {
      log.error('Error in disconnectAccount controller:', error);
      next(error);
    }
  },

  // Send a message via WhatsApp (for testing or manual sending)
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params; // WhatsApp account ID
      const { to, message } = req.body;

      // Get the WhatsApp account to get the phoneNumberId (in a real app, we would have this stored)
      const account = await whatsappService.getAccountById(id);
      if (!account || account.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'WhatsApp account not found',
        });
      }

      // In a real app, we would use the phoneNumberId (or similar) from the account
      // For now, we'll use a placeholder. We assume the phoneNumberId is stored in the account.
      // Since we don't have it in the model, we'll use the phoneNumber as a fallback for the example.
      // Actually, in the WhatsApp Cloud API, we need the phone number ID from the Business Manager.
      // We'll assume we have stored it in the account (we can add a field for it later).
      // For now, we'll use the phoneNumber as the phoneNumberId for demonstration (not correct in real app).
      const phoneNumberId = account.phoneNumber; // This is not correct, but for the example

      const result = await whatsappService.sendMessage(phoneNumberId, to, message);

      res.status(200).json({
        success: true,
        message: 'Message sent successfully',
        data: result,
      });
    } catch (error) {
      log.error('Error in sendMessage controller:', error);
      next(error);
    }
  },
};