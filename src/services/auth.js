import { supabase } from './supabase'

export const authService = {
  /**
   * Register a new user with email, password, full name, and role.
   * The role defaults to 'customer' if not specified.
   */
  async signUp(email, password, fullName, role = 'customer') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    })
    if (error) throw error
    return data
  },

  /**
   * Log in an existing user.
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  /**
   * Log out the current user.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Send a password reset link to the user's email.
   */
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#reset-password`,
    })
    if (error) throw error
    return data
  },

  /**
   * Update the password for the currently logged-in user.
   */
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
    return data
  },

  /**
   * Get the currently logged-in user's authentication data.
   */
  async getSessionUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return null
    return user
  },

  /**
   * Get the profile details (including role) for a given user ID.
   */
  async getUserProfile(userId) {
    if (!userId) return null
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return data
  },

  /**
   * Get both the session user and their profile.
   */
  async getCurrentUser() {
    const user = await this.getSessionUser()
    if (!user) return null
    const profile = await this.getUserProfile(user.id)
    return { ...user, profile }
  },

  /**
   * Update user profile details.
   */
  async updateProfile(userId, { fullName, avatarUrl }) {
    const updates = {
      id: userId,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(updates)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export default authService
