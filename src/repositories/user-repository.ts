import { Knex } from 'knex';
import { User } from '../types';

export class UserRepository {
  constructor(private db: Knex) {}

  async findAll(): Promise<User[]> {
    return this.db('users')
      .select('id', 'email', 'name', 'created_at', 'updated_at')
      .where('is_active', true);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db('users')
      .select('id', 'email', 'name', 'created_at', 'updated_at')
      .where({ id, is_active: true })
      .first();
    
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db('users')
      .select('*')
      .where({ email, is_active: true })
      .first();
    
    return user || null;
  }

  async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password_hash: string }): Promise<User> {
    const [user] = await this.db('users')
      .insert(userData)
      .returning(['id', 'email', 'name', 'created_at', 'updated_at']);
    
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const [user] = await this.db('users')
      .where({ id })
      .update({ ...userData, updated_at: this.db.fn.now() })
      .returning(['id', 'email', 'name', 'created_at', 'updated_at']);
    
    return user || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db('users')
      .where({ id })
      .update({ is_active: false, updated_at: this.db.fn.now() });
    
    return result > 0;
  }
}
