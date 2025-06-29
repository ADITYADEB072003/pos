import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export const userService = {
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async updateUserRole(userId: string, role: 'admin' | 'staff'): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      // Note: This will also delete the auth user due to CASCADE
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};