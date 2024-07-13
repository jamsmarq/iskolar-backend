import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    // private usersService: UsersService,
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<{ access_token: string, refresh_token: string }> {
    const supabaseClient = this.supabaseService.getClient();
    const supabaseAdmin = this.supabaseService.getAdmin();

    // Check if its a username or email
    if (!/@gmail\.com$/.test(email)) {
      // Check if the username exists
      const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('user_id').eq('username', email).single()

      if (profileError || !profile) {
        throw new UnauthorizedException('Username not found')
      }

      const userId = profile.user_id

      // Retrieve the email from auth.users
      const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

      if (userError || !user) {
        throw new UnauthorizedException('User not found')
      }

      email = user.user.email
    }

    // Authenticate user with email and pass
    const { data: auth, error: authError } = await supabaseClient.auth.signInWithPassword({ email: email, password: pass })

    if (authError || !auth) {
      throw new UnauthorizedException('Authentication failed')
    }

    const payload = { access_token: auth.session.access_token, refresh_token: auth.session.refresh_token}

    return payload 
  }

  async createUser(username: string, email: string, pass: string): Promise<any> {
    const supabaseClient = this.supabaseService.getClient();
    // const supabaseAdmin = this.supabaseService.getAdmin();

    // Check if the username already exists
    const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('user_id').eq('username', username).single()

    if (profileError || !profile) {
      throw new UnauthorizedException(profileError.message)
    }

    if (profile) {
      throw new UnauthorizedException('Username already exists')
    }

    // Check if the email already exists
    const { data: auth, error: authError } = await supabaseClient.auth.signUp({ email: email, password: pass })

    if (authError || !auth) {
      throw new UnauthorizedException(authError.message)
    }

    // Send a verification email to the user

    // Create the new account for the user

    return true
  }
}

