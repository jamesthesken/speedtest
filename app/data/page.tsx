'use client'
import Link from "next/link"
import AuthForm from "@/components/auth-form"
import { useCallback, useEffect, useState } from 'react'
import { supabase } from "@/api"
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Title,
} from "@tremor/react";
import { Database } from "@/types/supabase"

export default function PublicData() {
  const [loading, setLoading] = useState(true)
  const [publicData, setPublicData] = useState<any>()

  const getData = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('data1')
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
      {!loading &&
        <Card className="p-10">
          <Title className="text-center font-bold text-4xl">Speed Test Data</Title>
          <Table className="mt-10">
            <TableHead>
              <TableRow>
                <TableHeaderCell>State</TableHeaderCell>
                <TableHeaderCell>Zip Code</TableHeaderCell>
                <TableHeaderCell>Provider</TableHeaderCell>
                <TableHeaderCell># Residents</TableHeaderCell>
                <TableHeaderCell># Computers</TableHeaderCell>
                <TableHeaderCell>Download Speed</TableHeaderCell>
                <TableHeaderCell>Upload Speed</TableHeaderCell>
                <TableHeaderCell>Latency</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {publicData?.map((item: Database['public']['Views']['data1']['Row']) => (
                <TableRow key={item.id}>
                  <TableCell>{item.region}</TableCell>
                  <TableCell>
                    <Text>{item.zip}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{item.company}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{item.hh_size}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{item.num_comp}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{item.down}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{item.up}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{item.latency}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      }
    </div>
  )
}