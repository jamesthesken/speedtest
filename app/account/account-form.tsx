'use client'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { formatBytes } from '@/components/results'
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
} from "@tremor/react";

const SortTable = (items: any, config = null) => {
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

const PrivateTable = (props: any) => {
  const { items, requestSort, sortConfig } = SortTable(props.myData);
  const getClassNamesFor = (name: any) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <Card className="py-10 px-2">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>State{" "}
              <button type="button" onClick={() => requestSort('region')} className={getClassNamesFor('region')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Provider{" "}
              <button type="button" onClick={() => requestSort('company')} className={getClassNamesFor('company')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Download{" "}
              <button type="button" onClick={() => requestSort('down')} className={getClassNamesFor('down')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Upload{" "}
              <button type="button" onClick={() => requestSort('up')} className={getClassNamesFor('up')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Latency{" "}
              <button type="button" onClick={() => requestSort('latency')} className={getClassNamesFor('latency')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Street Address{" "}
              <button type="button" onClick={() => requestSort('street-address')} className={getClassNamesFor('street-address')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Zip{" "}
              <button type="button" onClick={() => requestSort('zip')} className={getClassNamesFor('zip')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Residents{" "}
              <button type="button" onClick={() => requestSort('hh_size')} className={getClassNamesFor('hh_size')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Computers{" "}
              <button type="button" onClick={() => requestSort('num_comp')} className={getClassNamesFor('num_comp')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Longitude{" "}
              <button type="button" onClick={() => requestSort('long')} className={getClassNamesFor('long')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Latitude{" "}
              <button type="button" onClick={() => requestSort('lat')} className={getClassNamesFor('lat')}>&#8597;</button>
            </TableHeaderCell>
            <TableHeaderCell>Time{" "}
              <button type="button" onClick={() => requestSort('created_at')} className={getClassNamesFor('created_at')}>&#8597;</button>
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((item: Database['public']['Tables']['test']['Row']) => (
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
                <Text>{item.street_address}</Text>
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
              <TableCell>
                <Text>{item.long}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.lat}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.created_at}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

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
  }, [supabase])

  useEffect(() => {
    getData()
  }, [user, getData])

  return (
    <div>
      <div className="top-0 w-full bg-slate-800 border-solid border-4 border-slate-900 text-center rounded-xl opacity-90 z-10">
        <div className="pt-5 pb-2">
          <h1 className="text-lg">Signed in as <u>{session?.user.email}</u></h1>
        </div>
        <div className="px-10 pb-8">
          <form action="/auth/signout" method="post">
            <button 
              type="submit" 
              className="w-full h-10 text-2xl font-bold text-white bg-red-900 hover:bg-red-800 rounded-lg"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
      <div className="">
      {!loading &&
        <PrivateTable myData={allData}/>
      }
      </div>
    </div>
  )
}