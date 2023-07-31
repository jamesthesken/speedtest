'use client'
import { useCallback, useEffect, useState } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [allData, setAllData] = useState<any>(null)
  const user = session?.user

  const getData = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('test')
        .select()
        
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setAllData(data)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getData()
  }, [user, getData])

  return (
    <div className="form-widget">
      <div>
        <h1>Signed in as {session?.user.email} </h1>
      </div>
      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
      <pre>{JSON.stringify(allData, null, 2)}</pre>
    </div>
  )
}