'use client'
import Link from "next/link"
import AuthForm from "@/components/auth-form"
import { useCallback, useEffect, useState, useMemo } from 'react'
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
import { formatBytes } from "@/components/results"

const sortTable = (items: any, config = null) => {
  const [sortConfig, setSortConfig] = useState<any>(config);

  const sortedData = useMemo(() => {
    let sortableData = [...items ?? []];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1: 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1: -1;
        }
        return 0;
      });
    }
    return sortableData
  }, [items, sortConfig])

  const requestSort = (key: any) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedData, requestSort, sortConfig}
};

const PublicTable = (props: any) => {
  const { items, requestSort, sortConfig } = sortTable(props.myData);
  const getClassNamesFor = (name: any) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <Card className="p-10">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>State{" "}
              <button type="button" onClick={() => requestSort('region')} className={getClassNamesFor('region')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Provider{" "}
              <button type="button" onClick={() => requestSort('company')} className={getClassNamesFor('company')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Download Speed{" "}
              <button type="button" onClick={() => requestSort('down')} className={getClassNamesFor('down')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Upload Speed{" "}
              <button type="button" onClick={() => requestSort('up')} className={getClassNamesFor('up')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Latency{" "}
              <button type="button" onClick={() => requestSort('latency')} className={getClassNamesFor('latency')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Zip Code{" "}
              <button type="button" onClick={() => requestSort('zip')} className={getClassNamesFor('zip')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell># Residents{" "}
              <button type="button" onClick={() => requestSort('hh_size')} className={getClassNamesFor('hh_size')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell># Computers{" "}
              <button type="button" onClick={() => requestSort('num_comp')} className={getClassNamesFor('num_comp')}>&#8597;</button>
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((item: Database['public']['Views']['data1']['Row']) => (
            <TableRow key={item.id}>
              <TableCell>
                <Text>{item.region}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.company}</Text>
              </TableCell>
              <TableCell>
                <Text>{formatBytes(item.down ?? 0)}</Text>
              </TableCell>
              <TableCell>
                <Text>{formatBytes(item.up ?? 0)}</Text>
              </TableCell>
              <TableCell>
                <Text>{formatBytes(item.latency ?? 0)}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.zip}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.hh_size}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.num_comp}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

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
      <div className="absolute top right-10">
        <AuthForm />
      </div>
      <div className="mx-auto max-w-2xl py-12 sm:py-20 lg:py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Speed Test Data
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Wow! what an amazing speed testing website. 
            Here is the data collected so far (minus
            any personally identifiable information).
            Feel free to view and use the data,
            or {" "}
            <Link 
              className="whitespace-nowrap text-lg font-medium text-blue-600 hover:text-blue-400"
              href="../"
              prefetch={false}
            >
              go back to speedtest
            </Link>
          </p>
        </div>
      </div>
      {!loading &&
        <PublicTable myData={publicData} />
      }
    </div>
  )
}