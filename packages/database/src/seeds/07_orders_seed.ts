import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Primero necesitamos obtener una organización existente
  const organization = await knex('organizations').first();
  
  if (!organization) {
    console.log('No organizations found, skipping orders seed');
    return;
  }

  // Crear algunos pedidos de ejemplo
  const orders = [
    {
      organization_id: organization.id,
      order_number: 'O20240101-0001',
      description: 'Pedido de prueba 1',
      total_amount: 150.00,
      pickup_address: 'Av. Reforma 123, Ciudad de México',
      delivery_address: 'Calle Juárez 456, Ciudad de México',
      pickup_lat: 19.4326,
      pickup_lng: -99.1332,
      delivery_lat: 19.4326,
      delivery_lng: -99.1332,
      status: 'PENDING'
    },
    {
      organization_id: organization.id,
      order_number: 'O20240101-0002',
      description: 'Pedido de prueba 2',
      total_amount: 89.50,
      pickup_address: 'Insurgentes Sur 789, Ciudad de México',
      delivery_address: 'Roma Norte 321, Ciudad de México',
      pickup_lat: 19.4326,
      pickup_lng: -99.1332,
      delivery_lat: 19.4326,
      delivery_lng: -99.1332,
      status: 'PENDING'
    }
  ];

  await knex('orders').insert(orders);
  console.log('✅ Orders seeded successfully');
}
