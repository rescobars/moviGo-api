import { BaseEmailTemplate } from '../templates/base-email.template';

export interface PasswordlessLoginEmailData {
  token: string;
  verificationCode: string;
  loginUrl: string;
}

export class PasswordlessLoginNotification {
  static generateContent(data: PasswordlessLoginEmailData): string {
    return `
      <p style="color: #666; line-height: 1.6;">
        Has solicitado acceder a tu cuenta de moviGo. Puedes usar cualquiera de estas opciones para iniciar sesión de forma segura:
      </p>
      
      ${BaseEmailTemplate.getCodeDisplay(data.verificationCode)}
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; margin-bottom: 15px;">O usa este enlace directo:</p>
        ${BaseEmailTemplate.getButton(data.loginUrl, '🔑 Iniciar Sesión con Enlace')}
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        <strong>⚠️ Importante:</strong> Este código y enlace son válidos por 15 minutos y solo pueden ser usados una vez.
      </p>
      
      <p style="color: #666; font-size: 14px;">
        Si no solicitaste este acceso, puedes ignorar este email de forma segura.
      </p>
    `;
  }

  static getSubject(): string {
    return '🔑 Tu código de acceso moviGo';
  }
}
