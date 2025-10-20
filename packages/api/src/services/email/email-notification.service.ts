import { Resend } from 'resend';
import { EmailNotificationType } from './types';
import { BaseEmailTemplate } from './templates';
import { 
  OrderCreatedNotification, 
  type OrderCreatedEmailData,
  PasswordlessLoginNotification,
  type PasswordlessLoginEmailData,
  EmailVerificationNotification,
  type EmailVerificationEmailData
} from './notifications';

export class EmailNotificationService {
  private static resend: Resend | null = null;

  private static getResendInstance(): Resend | null {
    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️ RESEND_API_KEY not configured, skipping email send');
      return null;
    }

    if (!this.resend) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    return this.resend;
  }

  private static getTargetEmail(email: string): string {
    // In development, redirect all emails to the configured development email
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production';
    return isDevelopment && process.env.DEV_EMAIL ? process.env.DEV_EMAIL : email;
  }

  static async sendOrderCreatedNotification(
    email: string,
    data: OrderCreatedEmailData
  ): Promise<boolean> {
    try {
      const resend = this.getResendInstance();
      if (!resend) return true;

      const targetEmail = this.getTargetEmail(email);
      const content = OrderCreatedNotification.generateContent(data);
      const subject = OrderCreatedNotification.getSubject(data.orderNumber);

      const { error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: [targetEmail],
        subject,
        html: BaseEmailTemplate.getEmailTemplate('¡Pedido Creado! 🎉', content)
      });

      if (error) {
        console.error('❌ Error sending order created email:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      console.log(`✅ Order created email sent to ${targetEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending order created email:', error);
      return false;
    }
  }

  static async sendPasswordlessLoginNotification(
    email: string,
    data: PasswordlessLoginEmailData
  ): Promise<boolean> {
    try {
      const resend = this.getResendInstance();
      if (!resend) return true;

      const targetEmail = this.getTargetEmail(email);
      const content = PasswordlessLoginNotification.generateContent(data);
      const subject = PasswordlessLoginNotification.getSubject();

      const { error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: [targetEmail],
        subject,
        html: BaseEmailTemplate.getEmailTemplate('¡Hola! 👋', content)
      });

      if (error) {
        console.error('❌ Error sending passwordless login email:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      console.log(`✅ Passwordless login email sent to ${targetEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending passwordless login email:', error);
      return false;
    }
  }

  static async sendEmailVerificationNotification(
    email: string,
    data: EmailVerificationEmailData
  ): Promise<boolean> {
    try {
      const resend = this.getResendInstance();
      if (!resend) return true;

      const targetEmail = this.getTargetEmail(email);
      const content = EmailVerificationNotification.generateContent(data);
      const subject = EmailVerificationNotification.getSubject();

      const { error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: [targetEmail],
        subject,
        html: BaseEmailTemplate.getEmailTemplate('¡Bienvenido a moviGo! 🎉', content)
      });

      if (error) {
        console.error('❌ Error sending email verification:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      console.log(`✅ Email verification sent to ${targetEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending email verification:', error);
      return false;
    }
  }

  // Centralized notification dispatcher
  static async sendNotification(
    type: EmailNotificationType,
    email: string,
    data: any
  ): Promise<boolean> {
    switch (type) {
      case EmailNotificationType.ORDER_CREATED:
        return this.sendOrderCreatedNotification(email, data);
      
      case EmailNotificationType.PASSWORDLESS_LOGIN:
        return this.sendPasswordlessLoginNotification(email, data);
      
      case EmailNotificationType.EMAIL_VERIFICATION:
        return this.sendEmailVerificationNotification(email, data);
      
      case EmailNotificationType.ORGANIZATION_INVITATION:
        console.warn(`⚠️ Email notification type ${type} not implemented yet`);
        return false;
      
      default:
        console.warn(`⚠️ Email notification type ${type} not implemented yet`);
        return false;
    }
  }
}
