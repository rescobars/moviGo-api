import { Knex } from 'knex';
import { User, CreateUser, UpdateUser } from '../../../types/src/schemas/user';

export class UserRepository {
  private static db: Knex;

  static setDb(database: Knex) {
    UserRepository.db = database;
  }

  static async findAll(): Promise<User[]> {
    return UserRepository.db('users')
      .select('*')
      .where('is_active', true);
  }

  static async findById(id: string): Promise<User | null> {
    const user = await UserRepository.db('users')
      .select('*')
      .where({ id, is_active: true })
      .first();
    
    return user || null;
  }

  static async findByUuid(uuid: string): Promise<User | null> {
    const user = await UserRepository.db('users')
      .select('*')
      .where({ uuid, is_active: true })
      .first();
    
    return user || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await UserRepository.db('users')
      .select('*')
      .where({ email, is_active: true })
      .first();
    
    return user || null;
  }

  static async create(userData: CreateUser & { password_hash: string }): Promise<User> {
    const [user] = await UserRepository.db('users')
      .insert(userData)
      .returning('*');
    
    return user;
  }

  static async update(id: string, userData: UpdateUser): Promise<User | null> {
    const [user] = await UserRepository.db('users')
      .where({ id })
      .update({ ...userData, updated_at: UserRepository.db.fn.now() })
      .returning('*');
    
    return user || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await UserRepository.db('users')
      .where({ id })
      .update({ is_active: false, updated_at: UserRepository.db.fn.now() });
    
    return result > 0;
  }

  static async updateStatus(id: string, status: string): Promise<User | null> {
    const [user] = await UserRepository.db('users')
      .where({ id })
      .update({ status, updated_at: UserRepository.db.fn.now() })
      .returning('*');
    
    return user || null;
  }
}
