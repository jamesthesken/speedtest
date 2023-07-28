import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Supabase(){
    const supabase = createServerComponentClient({cookies});
    const { data } = await supabase.from("test").select();
    return (
      <pre>{JSON.stringify(data, null, 2)}</pre>
    );
}