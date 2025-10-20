export class BaseEmailTemplate {
  static getEmailTemplate(title: string, content: string): string {
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

  static getCodeDisplay(code: string): string {
    return `
      <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0; text-align: center;">🔢 Tu código de verificación</h3>
        <div style="text-align: center; margin: 20px 0;">
          <div style="background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 10px; letter-spacing: 5px; display: inline-block; min-width: 200px;">
            ${code}
          </div>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
          Ingresa este código en la aplicación para acceder a tu cuenta
        </p>
      </div>
    `;
  }

  static getButton(link: string, text: string): string {
    return `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" 
           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  color: white; 
                  padding: 15px 30px; 
                  text-decoration: none; 
                  border-radius: 25px; 
                  display: inline-block; 
                  font-weight: bold;
                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
          ${text}
        </a>
      </div>
    `;
  }

  static getInfoBox(title: string, content: string): string {
    return `
      <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #333; margin-top: 0;">${title}</h3>
        ${content}
      </div>
    `;
  }
}
