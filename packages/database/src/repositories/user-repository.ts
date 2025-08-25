import { Knex } from 'knex';
import { User, CreateUser, UpdateUser } from '../../../types/src/schemas/user';
import { db } from '../db-config';

export class UserRepository {

  static async findAll(): Promise<User[]> {
    return db('users')
      .select('*')
      .where('is_active', true);
  }

  static async findById(id: number): Promise<User | null> {
    const user = await db('users')
      .select('*')
      .where({ id, is_active: true })
      .first();
    
    return user || null;
  }

  static async findByUuid(uuid: string): Promise<User | null> {
    const user = await db('users')
      .select('*')
      .where({ uuid, is_active: true })
      .first();
    
    return user || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await db('users')
      .select('*')
      .where({ email, is_active: true })
      .first();
    
    return user || null;
  }

  static async create(userData: Omit<CreateUser, 'password'> & { password_hash: string }): Promise<User> {
    const [user] = await db('users')
      .insert(userData)
      .returning('*');
    
    return user;
  }

  static async update(id: number, userData: UpdateUser): Promise<User | null> {
    const [user] = await db('users')
      .where({ id })
      .update({ ...userData, updated_at: db.fn.now() })
      .returning('*');
    
    return user || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db('users')
      .where({ id })
      .update({ is_active: false, updated_at: db.fn.now() });
    
    return result > 0;
  }

  static async updateStatus(id: number, status: string): Promise<User | null> {
    const [user] = await db('users')
      .where({ id })
      .update({ status, updated_at: db.fn.now() })
      .returning('*');
    
    return user || null;
  }
}
