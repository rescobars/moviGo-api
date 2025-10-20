import { BaseEmailTemplate } from '../templates/base-email.template';

export interface EmailVerificationEmailData {
  name: string;
  verificationCode: string;
}

export class EmailVerificationNotification {
  static generateContent(data: EmailVerificationEmailData): string {
    return `
      <p style="color: #666; line-height: 1.6;">
        Hola <strong>${data.name}</strong>, bienvenido a moviGo!
      </p>
      
      ${BaseEmailTemplate.getCodeDisplay(data.verificationCode)}
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        <strong>⚠️ Importante:</strong> Este código es válido por 15 minutos y solo puede ser usado una vez.
      </p>
      
      <p style="color: #666; font-size: 14px;">
        Si no solicitaste esta verificación, puedes ignorar este email de forma segura.
      </p>
    `;
  }

  static getSubject(): string {
    return '🔐 Verifica tu cuenta moviGo';
  }
}
