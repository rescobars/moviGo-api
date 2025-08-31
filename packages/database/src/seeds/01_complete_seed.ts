import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  console.log('🌱 Starting complete seed...');

  // 1. Create organizations
  console.log('📦 Creating organizations...');
  const organizations = [
    {
      name: 'Movigo Inc',
      slug: 'movigo-inc',
      description: 'Empresa líder en logística y delivery',
      domain: 'movigo.com',
      contact_email: 'info@movigo.com',
      contact_phone: '+502 5555-0000',
      address: 'Zona 4, Ciudad de Guatemala',
      status: 'ACTIVE',
      plan_type: 'PREMIUM',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'El Buen Sabor',
      slug: 'el-buen-sabor',
      description: 'Restaurante de comida tradicional guatemalteca',
      domain: 'elbuensabor.com',
      contact_email: 'pedidos@elbuensabor.com',
      contact_phone: '+502 5555-1111',
      address: 'Zona 1, Ciudad de Guatemala',
      status: 'ACTIVE',
      plan_type: 'STANDARD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Pizza Express',
      slug: 'pizza-express',
      description: 'Pizzería artesanal con ingredientes frescos',
      domain: 'pizzaexpress.com',
      contact_email: 'ordenes@pizzaexpress.com',
      contact_phone: '+502 5555-2222',
      address: 'Zona 10, Ciudad de Guatemala',
      status: 'ACTIVE',
      plan_type: 'STANDARD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Sushi Master',
      slug: 'sushi-master',
      description: 'Restaurante japonés con sushi de alta calidad',
      domain: 'sushimaster.com',
      contact_email: 'reservas@sushimaster.com',
      contact_phone: '+502 5555-3333',
      address: 'Zona 15, Ciudad de Guatemala',
      status: 'ACTIVE',
      plan_type: 'STANDARD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Café Central',
      slug: 'cafe-central',
      description: 'Cafetería artesanal con granos de origen único',
      domain: 'cafecentral.com',
      contact_email: 'cafe@cafecentral.com',
      contact_phone: '+502 5555-4444',
      address: 'Zona 9, Ciudad de Guatemala',
      status: 'ACTIVE',
      plan_type: 'BASIC',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const [movigoOrg, elBuenSaborOrg, pizzaExpressOrg, sushiMasterOrg, cafeCentralOrg] = await knex('organizations').insert(organizations).returning('*');

  // 2. Create users
  console.log('👥 Creating users...');
  const users = [
    {
      email: 'admin@movigo.com',
      name: 'Admin Movigo',
      password_hash: '$2b$10$rQZ9K8mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6',
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      email: 'gerente@elbuensabor.com',
      name: 'María González',
      password_hash: '$2b$10$rQZ9K8mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6',
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      email: 'chef@pizzaexpress.com',
      name: 'Carlos Rodríguez',
      password_hash: '$2b$10$rQZ9K8mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6',
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      email: 'manager@sushimaster.com',
      name: 'Ana Martínez',
      password_hash: '$2b$10$rQZ9K8mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6',
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      email: 'barista@cafecentral.com',
      name: 'Luis Hernández',
      password_hash: '$2b$10$rQZ9K8mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6jK9mN2pL7vX1cF3gH6',
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const [adminUser, mariaUser, carlosUser, anaUser, luisUser] = await knex('users').insert(users).returning('*');

  // 3. Create organization members
  console.log('🔗 Creating organization members...');
  const members = [
    {
      organization_id: movigoOrg.id,
      user_id: adminUser.id,
      title: 'CEO & Founder',
      notes: 'Fundador y CEO de Movigo Inc',
      status: 'ACTIVE',
      is_active: true,
      joined_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_id: elBuenSaborOrg.id,
      user_id: mariaUser.id,
      title: 'Gerente General',
      notes: 'Gerente del restaurante El Buen Sabor',
      status: 'ACTIVE',
      is_active: true,
      joined_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_id: pizzaExpressOrg.id,
      user_id: carlosUser.id,
      title: 'Chef Principal',
      notes: 'Chef principal de Pizza Express',
      status: 'ACTIVE',
      is_active: true,
      joined_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_id: sushiMasterOrg.id,
      user_id: anaUser.id,
      title: 'Manager',
      notes: 'Manager del restaurante Sushi Master',
      status: 'ACTIVE',
      is_active: true,
      joined_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_id: cafeCentralOrg.id,
      user_id: luisUser.id,
      title: 'Barista Principal',
      notes: 'Barista principal de Café Central',
      status: 'ACTIVE',
      is_active: true,
      joined_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  await knex('organization_members').insert(members);

  // 3.1. Create member roles for platform admins
  console.log('👑 Creating member roles...');
  const memberRoles = [
    {
      organization_member_id: 1, // Movigo admin
      role_name: 'PLATFORM_ADMIN',
      description: 'Administrador de plataforma con acceso completo',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        'platform': ['*'],
        'organizations': ['*'],
        'users': ['*'],
        'orders': ['*'],
        'routes': ['*'],
        'analytics': ['*'],
        'settings': ['*']
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_member_id: 2, // El Buen Sabor admin
      role_name: 'ORGANIZATION_ADMIN',
      description: 'Administrador de organización con acceso completo a su organización',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        'organization': ['*'],
        'orders': ['*'],
        'routes': ['*'],
        'members': ['*'],
        'analytics': ['read'],
        'settings': ['read', 'update']
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_member_id: 3, // Pizza Express admin
      role_name: 'ORGANIZATION_ADMIN',
      description: 'Administrador de organización con acceso completo a su organización',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        'organization': ['*'],
        'orders': ['*'],
        'routes': ['*'],
        'members': ['*'],
        'analytics': ['read'],
        'settings': ['read', 'update']
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_member_id: 4, // Sushi Master admin
      role_name: 'ORGANIZATION_ADMIN',
      description: 'Administrador de organización con acceso completo a su organización',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        'organization': ['*'],
        'orders': ['*'],
        'routes': ['*'],
        'members': ['*'],
        'analytics': ['read'],
        'settings': ['read', 'update']
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_member_id: 5, // Café Central admin
      role_name: 'ORGANIZATION_ADMIN',
      description: 'Administrador de organización con acceso completo a su organización',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        'organization': ['*'],
        'orders': ['*'],
        'routes': ['*'],
        'members': ['*'],
        'analytics': ['read'],
        'settings': ['read', 'update']
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  await knex('member_roles').insert(memberRoles);

  // 4. Create orders for each organization
  console.log('📋 Creating orders...');
  const orders = [
    // Movigo Inc orders
    {
      order_number: 'MOV-001',
      description: 'Entrega de documentos urgentes',
      total_amount: 150.00,
      status: 'PENDING',
      organization_id: movigoOrg.id,
      pickup_address: 'Oficina Central, Zona 4',
      delivery_address: 'Cliente A, Zona 10',
      pickup_lat: 14.63159,
      pickup_lng: -90.60626,
      delivery_lat: 14.63456,
      delivery_lng: -90.59876,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      order_number: 'MOV-002',
      description: 'Transporte de equipos',
      total_amount: 300.00,
      status: 'ASSIGNED',
      organization_id: movigoOrg.id,
      pickup_address: 'Almacén, Zona 12',
      delivery_address: 'Cliente B, Zona 15',
      pickup_lat: 14.63200,
      pickup_lng: -90.60500,
      delivery_lat: 14.63500,
      delivery_lng: -90.59500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // El Buen Sabor orders
    {
      order_number: 'EBS-001',
      description: 'Comida tradicional guatemalteca',
      total_amount: 85.50,
      status: 'PENDING',
      organization_id: elBuenSaborOrg.id,
      pickup_address: 'Restaurante El Buen Sabor, Zona 1',
      delivery_address: 'Cliente C, Zona 9',
      pickup_lat: 14.63300,
      pickup_lng: -90.60200,
      delivery_lat: 14.63600,
      delivery_lng: -90.59200,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Pizza Express orders
    {
      order_number: 'PE-001',
      description: 'Pizza margherita grande',
      total_amount: 120.00,
      status: 'PENDING',
      organization_id: pizzaExpressOrg.id,
      pickup_address: 'Pizzeria Pizza Express, Zona 10',
      delivery_address: 'Cliente D, Zona 13',
      pickup_lat: 14.63400,
      pickup_lng: -90.60000,
      delivery_lat: 14.63700,
      delivery_lng: -90.59000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Sushi Master orders
    {
      order_number: 'SM-001',
      description: 'Combo sushi premium',
      total_amount: 200.00,
      status: 'PENDING',
      organization_id: sushiMasterOrg.id,
      pickup_address: 'Restaurante Sushi Master, Zona 15',
      delivery_address: 'Cliente E, Zona 16',
      pickup_lat: 14.63500,
      pickup_lng: -90.59500,
      delivery_lat: 14.63800,
      delivery_lng: -90.58500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Café Central orders
    {
      order_number: 'CC-001',
      description: 'Café artesanal y pastelería',
      total_amount: 65.00,
      status: 'PENDING',
      organization_id: cafeCentralOrg.id,
      pickup_address: 'Café Central, Zona 9',
      delivery_address: 'Cliente F, Zona 11',
      pickup_lat: 14.63600,
      pickup_lng: -90.59200,
      delivery_lat: 14.63900,
      delivery_lng: -90.58200,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const [movigoOrder1, movigoOrder2, ebsOrder, peOrder, smOrder, ccOrder] = await knex('orders').insert(orders).returning('*');

  // 5. Create routes
  console.log('🛣️ Creating routes...');
  const routes = [
    {
      organization_id: movigoOrg.id,
      route_name: 'Ruta Movigo Express',
      description: 'Ruta optimizada para entregas urgentes',
      origin_lat: 14.63159,
      origin_lon: -90.60626,
      origin_name: 'Oficina Central Movigo',
      destination_lat: 14.63456,
      destination_lon: -90.59876,
      destination_name: 'Cliente A',
      waypoints: JSON.stringify([
        {
          lat: 14.63200,
          lon: -90.60500,
          name: 'Punto Intermedio 1'
        }
      ]),
      route_points: JSON.stringify([
        {
          lat: 14.63159,
          lon: -90.60626,
          name: 'Oficina Central Movigo',
          traffic_delay: 0,
          speed: 35,
          congestion_level: 'free_flow',
          waypoint_type: 'origin',
          waypoint_index: 0
        },
        {
          lat: 14.63200,
          lon: -90.60500,
          name: 'Punto Intermedio 1',
          traffic_delay: 0,
          speed: 35,
          congestion_level: 'free_flow',
          waypoint_type: 'waypoint',
          waypoint_index: 1
        },
        {
          lat: 14.63456,
          lon: -90.59876,
          name: 'Cliente A',
          traffic_delay: 0,
          speed: 35,
          congestion_level: 'free_flow',
          waypoint_type: 'destination',
          waypoint_index: 2
        }
      ]),
      ordered_waypoints: JSON.stringify([
        {
          order_id: movigoOrder1.id,
          order: 1
        }
      ]),
      traffic_condition: JSON.stringify({
        current_time: new Date().toISOString(),
        weather: 'clear',
        road_conditions: 'good',
        general_congestion: 'low'
      }),
      traffic_delay: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      organization_id: elBuenSaborOrg.id,
      route_name: 'Ruta El Buen Sabor',
      description: 'Ruta para entrega de comida tradicional',
      origin_lat: 14.63300,
      origin_lon: -90.60200,
      origin_name: 'Restaurante El Buen Sabor',
      destination_lat: 14.63600,
      destination_lon: -90.59200,
      destination_name: 'Cliente C',
      waypoints: JSON.stringify([]),
      route_points: JSON.stringify([
        {
          lat: 14.63300,
          lon: -90.60200,
          name: 'Restaurante El Buen Sabor',
          traffic_delay: 0,
          speed: 30,
          congestion_level: 'light',
          waypoint_type: 'origin',
          waypoint_index: 0
        },
        {
          lat: 14.63600,
          lon: -90.59200,
          name: 'Cliente C',
          traffic_delay: 0,
          speed: 30,
          congestion_level: 'light',
          waypoint_type: 'destination',
          waypoint_index: 1
        }
      ]),
      ordered_waypoints: JSON.stringify([
        {
          order_id: ebsOrder.id,
          order: 1
        }
      ]),
      traffic_condition: JSON.stringify({
        current_time: new Date().toISOString(),
        weather: 'clear',
        road_conditions: 'good',
        general_congestion: 'low'
      }),
      traffic_delay: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const [movigoRoute, ebsRoute] = await knex('routes').insert(routes).returning('*');

  // 6. Create route orders
  console.log('🔗 Creating route orders...');
  const routeOrders = [
    {
      route_id: movigoRoute.id,
      order_id: movigoOrder1.id,
      sequence_order: 1,
      created_at: new Date().toISOString()
    },
    {
      route_id: ebsRoute.id,
      order_id: ebsOrder.id,
      sequence_order: 1,
      created_at: new Date().toISOString()
    }
  ];

  await knex('route_orders').insert(routeOrders);

  console.log('✅ Complete seed finished successfully!');
  console.log(`📊 Created: ${organizations.length} organizations, ${users.length} users, ${members.length} members, ${memberRoles.length} member roles, ${orders.length} orders, ${routes.length} routes`);
}
