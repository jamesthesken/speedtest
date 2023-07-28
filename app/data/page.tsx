'use client'
import Link from "next/link"
import AuthForm from "@/components/auth-form"
import { useCallback, useEffect, useState } from 'react'
import { supabase } from "@/api"

export default function PublicData() {
  const [loading, setLoading] = useState(true)
  const [publicData, setPublicData] = useState<any>(null)

  const getData = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('data')
        .select()
        
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setPublicData(data)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    getData()
  }, [getData])

  return(
    <div>
        <Link href="../">Back to speedtest</Link>
        <AuthForm />
        <pre>{JSON.stringify(publicData, null, 2)}</pre>
    </div>
  )
}