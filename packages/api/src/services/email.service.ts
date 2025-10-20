import { 
  EmailNotificationService, 
  EmailNotificationType, 
  type OrderCreatedEmailData,
  type PasswordlessLoginEmailData,
  type EmailVerificationEmailData
} from './email';

export class EmailService {
  static async sendPasswordlessLoginToken(email: string, token: string, verificationCode: string): Promise<boolean> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify?token=${token}`;
    
    const data: PasswordlessLoginEmailData = {
      token,
      verificationCode,
      loginUrl
    };

    return EmailNotificationService.sendPasswordlessLoginNotification(email, data);
  }


  static async sendEmailVerification(
    email: string, 
    name: string, 
    verificationCode: string
  ): Promise<boolean> {
    const data: EmailVerificationEmailData = {
      name,
      verificationCode
    };

    return EmailNotificationService.sendEmailVerificationNotification(email, data);
  }

  // New notification methods using the centralized system
  static async sendOrderCreatedNotification(
    email: string,
    data: OrderCreatedEmailData
  ): Promise<boolean> {
    return EmailNotificationService.sendOrderCreatedNotification(email, data);
  }

  static async sendNotification(
    type: EmailNotificationType,
    email: string,
    data: any
  ): Promise<boolean> {
    return EmailNotificationService.sendNotification(type, email, data);
  }
}
