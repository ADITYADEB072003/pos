import { supabase } from '../lib/supabase';
import { User } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

export const authService = {
  async signUp(email: string, password: string, name: string, role: 'admin' | 'staff'): Promise<AuthUser> {
    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          name,
          role,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to sign in');

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) return null;

      return {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
};