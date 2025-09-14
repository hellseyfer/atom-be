import { db } from '../../../config/firebase.config';
import { addDoc, collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore/lite';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';

const SALT_ROUNDS = 10;

class UserService {
  private userRef = collection(db, 'users');

  async createUser(email: string, password: string): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        const error = new Error('User with this email already exists') as any;
        error.code = 11000; // Duplicate key error code
        throw error;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const userData: Omit<IUser, 'id'> = {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const userRef = await addDoc(this.userRef, userData);
      return { 
        id: userRef.id, 
        ...userData 
      } as IUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const q = query(
        this.userRef,
        where('email', '==', normalizedEmail),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // Add comparePassword method to user object
      const user: IUser = {
        id: userDoc.id,
        email: userData.email,
        password: userData.password,
        createdAt: userData.createdAt?.toDate(),
        updatedAt: userData.updatedAt?.toDate(),
        comparePassword: async function(candidatePassword: string) {
          return bcrypt.compare(candidatePassword, this.password);
        }
      };
      
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user');
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      const userDocRef = doc(db, 'users', id);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const userData = userDoc.data();
      
      // Add comparePassword method to user object
      const user: IUser = {
        id: userDoc.id,
        email: userData.email,
        password: userData.password,
        createdAt: userData.createdAt?.toDate(),
        updatedAt: userData.updatedAt?.toDate(),
        comparePassword: async function(candidatePassword: string) {
          return bcrypt.compare(candidatePassword, this.password);
        }
      };
      
      return user;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw new Error('Failed to fetch user');
    }
  }

  async loginUser(email: string, password: string): Promise<{ user: Omit<IUser, 'password'>; token: string }> {
    const user = await this.findUserByEmail(email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isMatch = await user.comparePassword?.(password);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      env.jwtSecret,
      { expiresIn: '1d' }
    );
    
    // Remove password before returning user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    
    return { 
      user: userWithoutPassword, 
      token 
    };
  }
}

export const userService = new UserService();
