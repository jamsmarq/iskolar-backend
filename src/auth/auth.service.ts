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

  async validateUser(username: string, pass: string): Promise<{ access_token: string }> {
    const supabaseClient = this.supabaseService.getClient();
    const supabaseAdmin = this.supabaseService.getAdmin();

    // Check if the username exists
    const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('user_id').eq('username', username).single()

    if (profileError || !profile) {
      throw new UnauthorizedException('Username not found')
    }

    const userId = profile.user_id

    // Retreieve the email from auth.users
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (userError || !user) {
      throw new UnauthorizedException('User not found')
    }

    const userEmail = user.user.email

    // Authenticate user with email and pass
    const { data: auth, error: authError } = await supabaseClient.auth.signInWithPassword({ email: userEmail, password: pass })

    if (authError || !auth) {
      throw new UnauthorizedException('Authentication failed')
    }

    const payload = { sub: userId, email: userEmail }

    return { access_token: await this.jwtService.signAsync(payload) }
  }

  async createUser(username: string, email: string, pass: string): Promise<any> {
    const supabaseClient = this.supabaseService.getClient();
    const supabaseAdmin = this.supabaseService.getAdmin();

    // Check if the username already exists
    const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('username').eq('username', username).single()

    if (profileError || !profile) {
      throw new UnauthorizedException('Unexpected error')
    }

    if (profile.username === username) {
      throw new UnauthorizedException('Username already exists')
    }

    // Check if the password meet the requirements 

    // Send a verification email to the user

    return true
  }
}

