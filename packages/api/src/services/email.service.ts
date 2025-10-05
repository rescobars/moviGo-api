import { Resend } from 'resend';

export class EmailService {
  // Base email template
  private static getEmailTemplate(title: string, content: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🚀 moviGo</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu plataforma de pedidos</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">${title}</h2>
          ${content}
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 moviGo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `;
  }
  static async sendPasswordlessLoginToken(email: string, token: string, verificationCode: string): Promise<boolean> {
    try {
      // In development, redirect all emails to the configured development email
      const targetEmail = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') && process.env.DEV_EMAIL 
        ? process.env.DEV_EMAIL 
        : email;
      
      if (!process.env.RESEND_API_KEY) {
        console.log('⚠️ RESEND_API_KEY not configured, skipping email send');
        return true;
      }

      const resend = new Resend(process.env.RESEND_API_KEY);
      const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify?token=${token}`;

      const emailContent = `
        <p style="color: #666; line-height: 1.6;">
          Has solicitado acceder a tu cuenta de moviGo. Puedes usar cualquiera de estas opciones para iniciar sesión de forma segura:
        </p>
        
        <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0; text-align: center;">🔢 Tu código de verificación</h3>
          <div style="text-align: center; margin: 20px 0;">
            <div style="background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 10px; letter-spacing: 5px; display: inline-block; min-width: 200px;">
              ${verificationCode}
            </div>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
            Ingresa este código en la aplicación para acceder a tu cuenta
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666; margin-bottom: 15px;">O usa este enlace directo:</p>
          <a href="${loginUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    display: inline-block; 
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            🔑 Iniciar Sesión con Enlace
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          <strong>⚠️ Importante:</strong> Este código y enlace son válidos por 15 minutos y solo pueden ser usados una vez.
        </p>
        
        <p style="color: #666; font-size: 14px;">
          Si no solicitaste este acceso, puedes ignorar este email de forma segura.
        </p>
      `;

      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: [targetEmail || ''],
        subject: '🔑 Tu código de acceso moviGo',
        html: this.getEmailTemplate('¡Hola! 👋', emailContent)
      });

      if (error) {
        console.error('❌ Error sending email:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  static async sendOrganizationInvitation(
    email: string, 
    organizationName: string, 
    inviterName: string, 
    roles: string[], 
    invitationUrl: string
  ): Promise<boolean> {
    try {
      // In development, redirect all emails to the configured development email
      const targetEmail = process.env.NODE_ENV === 'development' && process.env.DEV_EMAIL 
        ? process.env.DEV_EMAIL 
        : email;
      
      if (!process.env.RESEND_API_KEY) {
        console.log('⚠️ RESEND_API_KEY not configured, skipping email send');
        return true;
      }

      const resend = new Resend(process.env.RESEND_API_KEY);
      const rolesText = roles.length === 1 ? roles[0] : roles.join(', ');

      const emailContent = `
        <p style="color: #666; line-height: 1.6;">
          <strong>${inviterName}</strong> te ha invitado a unirte a <strong>${organizationName}</strong> en moviGo.
        </p>
        
        <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #333; margin-top: 0;">📋 Detalles de la invitación:</h3>
          <ul style="color: #666; margin: 10px 0;">
            <li><strong>Organización:</strong> ${organizationName}</li>
            <li><strong>Invitado por:</strong> ${inviterName}</li>
            <li><strong>Roles asignados:</strong> ${rolesText}</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    display: inline-block; 
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            ✅ Aceptar Invitación
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          <strong>🚀 ¿Qué puedes hacer con moviGo?</strong>
        </p>
        <ul style="color: #666; font-size: 14px;">
          <li>Gestionar pedidos en tiempo real</li>
          <li>Asignar conductores a entregas</li>
          <li>Ver reportes y estadísticas</li>
          <li>Colaborar con tu equipo</li>
        </ul>
        
        <p style="color: #666; font-size: 14px;">
          <strong>⚠️ Importante:</strong> Esta invitación es válida por 7 días. Si tienes alguna pregunta, contacta a ${inviterName}.
        </p>
      `;

      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: [targetEmail],
        subject: `🎉 ¡Invitación a unirse a ${organizationName} en moviGo!`,
        html: this.getEmailTemplate('¡Invitación a unirse! 🎉', emailContent)
      });

      if (error) {
        console.error('❌ Error sending invitation email:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error sending invitation email:', error);
      return false;
    }
  }

  static async sendEmailVerification(
    email: string, 
    name: string, 
    verificationCode: string
  ): Promise<boolean> {
    try {
      // In development, redirect all emails to the configured development email
      const targetEmail = process.env.NODE_ENV === 'development' && process.env.DEV_EMAIL 
        ? process.env.DEV_EMAIL 
        : email;
      
      if (!process.env.RESEND_API_KEY) {
        console.log('⚠️ RESEND_API_KEY not configured, skipping email send');
        return true;
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const emailContent = `
        <p style="color: #666; line-height: 1.6;">
          Hola <strong>${name}</strong>, bienvenido a moviGo!
        </p>
        
        <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0; text-align: center;">🔢 Tu código de verificación</h3>
          <div style="text-align: center; margin: 20px 0;">
            <div style="background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 10px; letter-spacing: 5px; display: inline-block; min-width: 200px;">
              ${verificationCode}
            </div>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
            Ingresa este código en la aplicación para verificar tu cuenta
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          <strong>⚠️ Importante:</strong> Este código es válido por 15 minutos y solo puede ser usado una vez.
        </p>
        
        <p style="color: #666; font-size: 14px;">
          Si no solicitaste esta verificación, puedes ignorar este email de forma segura.
        </p>
      `;

      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: [targetEmail],
        subject: '🔐 Verifica tu cuenta moviGo',
        html: this.getEmailTemplate('¡Bienvenido a moviGo! 🎉', emailContent)
      });

      if (error) {
        console.error('❌ Error sending verification email:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      return false;
    }
  }
}
