import { Injectable, Scope } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import 'dotenv/config'

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient

  constructor () {
    this.supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  }

  getClient() : SupabaseClient {
    return this.supabaseClient
  }
}
