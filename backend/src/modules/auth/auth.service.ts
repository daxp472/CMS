import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { config } from '../../config/env';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationType: string | null;
    organizationId: string | null;
  };
  token: string;
}

export class AuthService {
  /**
   * Login user with email and password
   * Returns JWT token and user info
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        organizationType: true,
        organizationId: true,
        isActive: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw ApiError.forbidden('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiry,
      }
    );

    // Return user info (without password) and token
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationType: user.organizationType,
        organizationId: user.organizationId,
      },
      token,
    };
  }

  /**
   * Get user by ID (for /me endpoint)
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationType: true,
        organizationId: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }
}
