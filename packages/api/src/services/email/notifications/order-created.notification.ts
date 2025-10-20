import { BaseEmailTemplate } from '../templates/base-email.template';

export interface OrderCreatedEmailData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  estimatedDeliveryTime?: string;
  deliveryAddress: string;
  orderUrl?: string;
}

export class OrderCreatedNotification {
  static generateContent(data: OrderCreatedEmailData): string {
    const itemsList = data.items.map(item => 
      `<li style="margin: 8px 0; color: #666;">
        <strong>${item.name}</strong> - Cantidad: ${item.quantity} - $${item.price.toFixed(2)}
      </li>`
    ).join('');

    const estimatedDelivery = data.estimatedDeliveryTime 
      ? `<p style="color: #666; font-size: 14px; margin: 10px 0;">
          <strong>⏰ Tiempo estimado de entrega:</strong> ${data.estimatedDeliveryTime}
        </p>`
      : '';

    const orderButton = data.orderUrl 
      ? BaseEmailTemplate.getButton(data.orderUrl, '📦 Ver Detalles del Pedido')
      : '';

    return `
      <p style="color: #666; line-height: 1.6;">
        ¡Hola <strong>${data.customerName}</strong>! Tu pedido ha sido creado exitosamente.
      </p>
      
      ${BaseEmailTemplate.getInfoBox('📋 Detalles del Pedido', `
        <ul style="color: #666; margin: 10px 0;">
          <li><strong>Número de pedido:</strong> ${data.orderNumber}</li>
          <li><strong>Fecha:</strong> ${data.orderDate}</li>
          <li><strong>Dirección de entrega:</strong> ${data.deliveryAddress}</li>
        </ul>
      `)}
      
      <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">🛍️ Productos solicitados</h3>
        <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
          ${itemsList}
        </ul>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
        <div style="text-align: right;">
          <p style="color: #333; font-size: 18px; font-weight: bold; margin: 0;">
            Total: $${data.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
      
      ${estimatedDelivery}
      
      <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #155724; margin-top: 0;">✅ Próximos pasos</h3>
        <ul style="color: #155724; margin: 10px 0;">
          <li>Tu pedido está siendo procesado</li>
          <li>Te notificaremos cuando sea asignado a un conductor</li>
          <li>Recibirás actualizaciones en tiempo real del estado de tu pedido</li>
        </ul>
      </div>
      
      ${orderButton}
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        <strong>📞 ¿Necesitas ayuda?</strong> Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
      </p>
    `;
  }

  static getSubject(orderNumber: string): string {
    return `✅ Pedido #${orderNumber} creado exitosamente - moviGo`;
  }
}
