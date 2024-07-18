import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const supabase = createClient();

export default supabase;

// Utility functions for generating file URLs
export const getRecordFileUrl = (
  supabase: SupabaseClient,
  fileFieldName: string
) => (record: { [key: string]: any }) =>
    supabase.storage.from('files').getPublicUrl(record[fileFieldName]).data.publicUrl;

export const getAssetFileUrl = (supabase: SupabaseClient) =>
  getRecordFileUrl(supabase, 'file');

export const getAvatarUrl = getRecordFileUrl(supabase, 'avatar');

export const getIconUrl = getRecordFileUrl(supabase, 'icon');