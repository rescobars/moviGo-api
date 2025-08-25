import { Resend } from 'resend';

export class EmailService {
  static async sendPasswordlessLoginToken(email: string, token: string): Promise<boolean> {
    try {
      console.log(`📧 Sending passwordless login token to ${email}`);
      
      // Only initialize Resend if API key is available
      if (!process.env.RESEND_API_KEY) {
        console.log('⚠️ RESEND_API_KEY not configured, skipping email send');
        console.log(`🔑 Token: ${token}`);
        console.log(`🌐 Login URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${token}`);
        return true;
      }

      const resend = new Resend(process.env.RESEND_API_KEY);
      const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;
      
      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: [email],
        subject: '🔑 Tu código de acceso moviGo',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🚀 moviGo</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu plataforma de pedidos</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">¡Hola! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Has solicitado acceder a tu cuenta de moviGo. Usa el siguiente enlace para iniciar sesión de forma segura:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                  🔑 Iniciar Sesión
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>⚠️ Importante:</strong> Este enlace es válido por 15 minutos y solo puede ser usado una vez.
              </p>
              
              <p style="color: #666; font-size: 14px;">
                Si no solicitaste este acceso, puedes ignorar este email de forma segura.
              </p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2024 moviGo. Todos los derechos reservados.
              </p>
            </div>
          </div>
        `
      });

      if (error) {
        console.error('❌ Error sending email:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      console.log('✅ Email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }
}
