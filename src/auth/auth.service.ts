import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private supabaseService: SupabaseService,
    // private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const supabaseClient = this.supabaseService.getClient();

    const {data: profiles, error} = await supabaseClient.from('profiles').select('username').eq('username', username)

    // const {data, error} = await supabaseClient.auth.signInWithPassword({
    //   email: username,
    //   password: pass,
    // })

    if (error) { 
      console.log(error)
      throw new UnauthorizedException('Invalid credentials') 
    }

    return profiles
  }
}
