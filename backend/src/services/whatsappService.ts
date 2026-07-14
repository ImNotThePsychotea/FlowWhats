import { PrismaClient } from '@prisma/client';
import { log } from '../utils/logger';

const prisma = new PrismaClient();

export const whatsappService = {
  // Connect a WhatsApp account
  async connectAccount(userId: string, phoneNumber: string, token: string) {
    // In a real app, we would verify the token with WhatsApp API
    // For now, we just save it
    return prisma.whatsappAccount.create({
      data: {
        userId,
        phoneNumber,
        token,
        // In a real app, we would encrypt the token before saving
        // token: encrypt(token), // We'll implement encryption later
        isConnected: true,
      },
    });
  },

  // Get WhatsApp accounts for a user
  async getAccountsByUserId(userId: string) {
    return prisma.whatsappAccount.findMany({
      where: { userId },
    });
  },

  // Get a WhatsApp account by ID
  async getAccountById(id: string) {
    return prisma.whatsappAccount.findUnique({
      where: { id },
    });
  },

  // Update a WhatsApp account (e.g., to update token or connection status)
  async updateAccount(id: string, data: { token?: string; isConnected?: boolean }) {
    // If token is provided, we might want to encrypt it
    // if (data.token) {
    //   data.token = encrypt(data.token);
    // }
    return prisma.whatsappAccount.update({
      where: { id },
      data,
    });
  },

  // Disconnect a WhatsApp account
  async disconnectAccount(id: string) {
    return prisma.whatsappAccount.update({
      where: { id },
      data: { isConnected: false },
    });
  },

  // Send a message via WhatsApp (this would typically call the WhatsApp API)
  async sendMessage(phoneNumberId: string, to: string, message: string) {
    // This is a placeholder. In a real app, you would make an HTTP request to the WhatsApp Cloud API.
    // For example:
    // const response = await axios.post(
    //   `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
    //   {
    //     messaging_product: 'whatsapp',
    //     to,
    //     type: 'text',
    //     text: { body: message },
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );
    // return response.data;

    // For now, we just return a mock response
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  },
};