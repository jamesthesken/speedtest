'use client'
import Link from "next/link"
import AuthForm from "@/components/auth-form"
import { useCallback, useEffect, useState, useMemo } from 'react'
import { supabase } from "@/api"
import { Database } from "@/types/supabase"
import { formatBytes } from "@/components/results"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, LinearScale, CategoryScale } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline"
import { Chart } from "chart.js/dist"

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, LinearScale, CategoryScale);

const ServicePie = (props: any) => {
  const items = props.myData
  const show = props.display
  const serviceChart: any = {
    labels: ['Unserved', 'Underserved', 'Served'],
    datasets: [{
        label: '',
        data: [items[0].unserved, items[0].underserved, items[0].served],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        borderColor: 
          'rgb(240, 240, 240)',
        borderWidth: 3,
      },],
  };
  
  const serviceOptions: any = {
    animation: false,
    onResize: {},
    plugins: {
      legend: {
        onClick: (e: any) => e.stopPropagation,
        display: show,
        labels: {
          font: {
            size: 14,
            weight: "bolder",
          },
          color: '#ffefdf'
        },
      },
      datalabels: {
        display: show,
        formatter: (value: any, ctx: any) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data: any) => {
              sum += data;
          });
          let percentage = (value*100 / sum).toFixed(2)+"%";
          return percentage;
        },
        color: "white",
        font: {
          size: 24,
          weight: "bold",
        }
      },
    },
  };
  return (
    <Pie data={serviceChart} plugins={[ChartDataLabels]} options={serviceOptions}/>
  )
}

const ProviderBar = (props: any) => {
  const items = props.myData
  // const show = props.display
  const serviceChart: any = {
    labels: ['Spectrum', 'Hawaiian Telcom'],
    datasets: [
      {
        label: 'Download',
        data: [formatBytes(items[0].specd), formatBytes(items[0].hteld)],
        backgroundColor: 'rgb(53, 162, 235)',
        borderColor: 
          'rgb(240, 240, 240)',
        borderWidth: 3,
      },
      {
        label: 'Upload',
        data: [formatBytes(items[0].specu), formatBytes(items[0].htelu)],
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 
          'rgb(240, 240, 240)',
        borderWidth: 3,
      },
      {
        label: 'Latency',
        data: [formatBytes(items[0].specl), formatBytes(items[0].htell)],
        backgroundColor: 'rgb(255, 205, 86)',
        borderColor: 
          'rgb(240, 240, 240)',
        borderWidth: 3,
      },
      
    ],
  };
  var show = false
  const serviceOptions: any = {
    responsive: true,
    animation: false,
    onResize(chart: Chart ,size: { width: number; height: number }){if(size.width > 32) {show = true} else {show = false}} ,
    scales: {
      x: {
        display: show,
        ticks: {
          font: {
            size: 14,
            weight: "bolder",
          },
          color: '#ffefdf'
        }
      },
      y: {
        display: show,
        ticks: {
          font: {
            size: 14,
            weight: "bolder",
          },
          color: '#ffefdf'
        }
      }
    },
    plugins: {
      legend: {
        display: show,
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: "bolder",
          },
          color: '#ffefdf'
        },
      },
      datalabels: {
        display: show,
        color: "white",
        font: {
          size: 14,
          weight: "bold",
        }
      },
    },
  };
  return (
    <Bar data={serviceChart} plugins={[ChartDataLabels]} options={serviceOptions}/>
  )
}

export default function PublicData() {
  const [loading, setLoading] = useState(true)
  const [resultsData, setResultsData] = useState<any>()
  // const [dataPoint, setDataPoint] = useState<string | number>('Hawaii') //future feature
  const [showService, setShowService] = useState(true)
  const [showProvider, setShowProvider] = useState(false)
  const [showTime, setShowTime] = useState(false)

  const getData = useCallback(async () => {
    try {
      setLoading(true)
      let { data, error, status } = await supabase
        .from('results')
        .select()
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setResultsData(data)
      }
    } catch (error) {
      alert('Error loading results!')
    } finally {
      setLoading(false)
    }

  }, [])
  useEffect(() => {
    getData()
  }, [getData])

  const downloadFile = useCallback(async () => {
    let json = '';
    try {
      let { data, error, status } = await supabase
        .from('data')
        .select()
        .csv()
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        json = JSON.stringify(data)
      }
    } catch (error) {
      alert('Error loading data!');
    }
    const file = new Blob([json], {type: 'text/plain;charset=utf-8'});// anchor link
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "Kauai_Speed_Test.txt";// simulate link click
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }, [])

  return(
    <div className="bg-slate-900 w-full h-full">
      <div className="md:absolute md:top-0 md:right-5 md:p-0 px-8 pt-4">
        <AuthForm />
      </div>
      <div className="mx-auto max-w-2xl py-12 md:py-20 lg:py-24 px-2 sm:px-auto">
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
        <div className="mx-4">
          <div 
            className="h-152  flex flex-col"//outline outline-cyan-300 outline-1
          >
            <div 
              className={`w-full transition-all ${showService ? 'h-96' : 'h-24' } flex flex-row`} //outline outline-cyan-300 outline-1
              onMouseEnter={() => (setShowService(true), setShowTime(false), setShowProvider(false))}
            >
              <div className="w-10"></div>
              <ServicePie myData={resultsData} display={showService}/>
              <div className="flex flex-col justify-center">
              {!showService ? 
                <h2 className="pl-10 pb-8 text-xl font-bold"><u>Service Ratings</u></h2>
                :
                <div className="px-24">
                  <h1 className="text-4xl font-bold">Service Ratings</h1>
                  <p className="mt-5 text-lg">
                    This is an amazing description of how bad 
                    the service ratings are in Hawaii. Look at how 
                    many under and unserved users there are. We need to fight 
                    back against the FCC. This pie chart updates automatically btw.
                    I still need to add the actual data (maybe use a view). I could add 
                    links or create smoother transitions. Gotta find new features

                  </p>
                </div>
              }
              </div>
            </div>
            <div 
              className={`w-full transition-all ${showProvider ? 'h-96 py-0' : 'h-28 py-2' } flex flex-row`}
              onMouseEnter={() => (setShowProvider(true), setShowService(false), setShowTime(false))}
            >
              <div className="w-10"></div>
              <ProviderBar myData={resultsData} display={showProvider}/>
              <div className="flex flex-col justify-center">
              {!showProvider ? 
                <h2 className="pl-10 pb-8 text-xl font-bold"><u>Averages by Provider</u></h2>
                :
                <div className="pr-24 pl-10">
                  <h1 className="text-4xl font-bold">Averages by Provider</h1>
                  <p className="mt-5 text-lg">
                    This is an amazing description of how bad 
                    the service ratings are in Hawaii. Look at how 
                    many under and unserved users there are. We need to fight 
                    back against the FCC. This pie chart updates automatically btw.
                    I still need to add the actual data (maybe use a view). I could add 
                    links or create smoother transitions. Gotta find new features

                  </p>
                </div>
              }
              </div>
            </div>
            <div 
              className={`w-full transition-all ${showTime ? 'h-96' : 'h-24' } flex flex-row`} //outline outline-cyan-300 outline-1
              onMouseEnter={() => (setShowTime(true), setShowService(false), setShowProvider(false))}
            >
              <div className="w-10"></div>
              <ServicePie myData={resultsData} display={showTime}/>
              <div className="flex flex-col justify-center">
              {!showTime ? 
                <h2 className="pl-10 pb-8 text-xl font-bold"><u>Service Ratings</u></h2>
                :
                <div className="px-24">
                  <h1 className="text-4xl font-bold">Service Ratings</h1>
                  <p className="mt-5 text-lg">
                    This is an amazing description of how bad 
                    the service ratings are in Hawaii. Look at how 
                    many under and unserved users there are. We need to fight 
                    back against the FCC. This pie chart updates automatically btw.
                    I still need to add the actual data (maybe use a view). I could add 
                    links or create smoother transitions. Gotta find new features

                  </p>
                </div>
              }
              </div>
            </div>
          </div>
          <div className="my-16 grid gap-1 lg:grid-cols-3 grid-cols-1 md:grid-cols-2 items-center ">
            <div className="flex flex-col text-center basis-1/3 bg-slate-800 h-full w-full">
              <div className="p-5 items-center">
                <p>"Oh my god, is that a black card?" I turned around and replied, "Why yes But I prefer the term African American Express" - Kanye West</p>
              </div>
            </div>
            <div className="flex flex-col text-center basis-1/3 bg-slate-800 h-full w-full">
              <div className="p-5 items-center">
                <p>"People always say that you can't please everybody. I think that's a cop-out. Why not attempt it? 'Cause think of all the people you will please if you try." - Kanye West</p>
              </div>
            </div>
            <div className="flex flex-col text-center basis-1/3 bg-slate-800 h-full w-full">
              <div className="p-5 items-center">
                <p>"Maybe I couldn't be skinny and tall, but I'll settle for being the greatest artist of all time as a consolation." - Kanye West</p>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-col">
            <label className="text-blue-600 hover:text-blue-400">
              <button 
                onClick={downloadFile} 
                value="download" 
                className="whitespace-nowrap font-lg flex items-center py-1 px-2">
                <u>Download the data</u><DocumentArrowDownIcon className="h-5 w-5 ml-1"/>
              </button>
            </label>
          </div>
        </div>
      }
    </div>
  )
}