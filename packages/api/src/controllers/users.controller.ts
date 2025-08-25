import { Request, Response } from 'express';
import { UserRepository } from '../../../database/src/repositories/user-repository';
import { 
  UserSchema, 
  CreateUserSchema, 
  UpdateUserSchema, 
  LoginUserSchema 
} from '../../../types/src/schemas/user';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../auth/src/jwt';

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserRepository.findAll();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await UserRepository.findById(parseInt(id));
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  }

  static async getByUuid(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      
      const user = await UserRepository.findByUuid(uuid);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(validatedData.password, 10);
      
      // Create user data
      const userData = {
        email: validatedData.email,
        name: validatedData.name,
        password_hash: passwordHash,
        status: 'ACTIVE' as const
      };

      const user = await UserRepository.create(userData);
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = UpdateUserSchema.parse(req.body);
      
      const user = await UserRepository.update(parseInt(id), validatedData);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const deleted = await UserRepository.delete(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = LoginUserSchema.parse(req.body);
      
      const user = await UserRepository.findByEmail(validatedData.email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id.toString(),
        email: user.email
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            uuid: user.uuid,
            email: user.email,
            name: user.name,
            status: user.status
          },
          token
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value'
        });
      }
      
      const user = await UserRepository.updateStatus(parseInt(id), status);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user status'
      });
    }
  }
}
