"use client";
import { useState } from "react";
import SpeedTest from "@cloudflare/speedtest";
import Results from "../components/results";
import Footer from "@/components/footer";
import { InformationCircleIcon, BoltIcon } from "@heroicons/react/20/solid";
import { BroadBandMap } from "@/components/BroadbandMap";
import Link from "next/link";
import Contact from "@/components/contact";

export type SpeedTestResults = {
  download?: number | undefined;
  upload?: number | undefined;
  latency?: number | undefined;
  jitter?: number | undefined;
  downLoadedLatency?: number | undefined;
  downLoadedJitter?: number | undefined;
  upLoadedLatency?: number | undefined;
  upLoadedJitter?: number | undefined;
  packetLoss?: number | undefined;
  epoch: any;
  dateTime: any;
  streaming: {
    classificationName: string;
    points: number;
  };
  rtc: {
    classificationName: string;
    points: number;
  };
  gaming: {
    classificationName: string;
    points: number;
  };
};

export default function Home() {
  const [speedTestResults, setSpeedTestResults] = useState<any>();
  const [running, setRunning] = useState(false);

  const config = {
    autoStart: true,
    downloadApiUrl: "https://speed.cloudflare.com/__down",
    uploadApiUrl: "https://speed.cloudflare.com/__up",
    measurements: [
      { type: "latency", numPackets: 1 }, // initial latency estimation
      { type: "download", bytes: 1e5, count: 1, bypassMinDuration: true }, // initial download estimation
      { type: "latency", numPackets: 20 },
      { type: "download", bytes: 1e5, count: 9 },
      { type: "download", bytes: 1e6, count: 8 },
      { type: "upload", bytes: 1e5, count: 8 },
      { type: "packetLoss", numPackets: 1e3, responsesWaitTime: 3000 },
      { type: "upload", bytes: 1e6, count: 6 },
      { type: "download", bytes: 1e7, count: 6 },
      { type: "upload", bytes: 1e7, count: 4 },
      { type: "download", bytes: 2.5e7, count: 4 },
      { type: "upload", bytes: 2.5e7, count: 4 },
      { type: "download", bytes: 1e8, count: 3 },
      { type: "upload", bytes: 5e7, count: 3 },
      { type: "download", bytes: 2.5e8, count: 2 },
    ],
  };

  const safeFetch = async (url: any, options = {}) => {
    try {
      const request = await fetch(url, options);
      const json = JSON.parse(await request.text());
      const headers = await request.headers;
      return { json, headers };
    } catch (_) {
      return {};
    }
  };

  const runSpeedTest = async () => {
    const ua = { user_agent: window.navigator.userAgent };
    const meta = (await safeFetch("https://speed.cloudflare.com/meta")).json;
    const { utc_datetime, unixtime } = (
      await safeFetch("https://worldtimeapi.org/api/timezone/Etc/UTC")
    ).json;
    const ts = { epoch: unixtime, dateTime: utc_datetime };

    const engine = new SpeedTest(config as any);

    engine.onResultsChange = (results) => {
      setRunning(true);
      const summary = engine.results.getSummary();
      const scores = engine.results.getScores();
      setSpeedTestResults({ ...scores, ...summary, ...meta, ...ts, ...ua });

      const runningNode = document.createTextNode("Running ");
      const updateElement = document.getElementById("update");
      updateElement?.replaceChild(runningNode, updateElement.childNodes[0]);
    };

    engine.onFinish = (results) => {
      const summary = results.getSummary();
      const scores = results.getScores();
      setSpeedTestResults({ ...scores, ...summary, ...meta, ...ts, ...ua });
      console.log({ ...speedTestResults });
      const finishedElement = document.createElement("div");
      finishedElement.id = "speedtest-finished";
      document.body.appendChild(finishedElement);

      const spinnerElement = document.getElementById("spinner");
      spinnerElement?.remove();
      const finishedNode = document.createTextNode("Speed Test Results:");
      const updateElement = document.getElementById("update");
      updateElement?.replaceChild(finishedNode, updateElement.childNodes[0]);
    };

    console.log("running");

    engine.play();

    setShowButton(!showButton);
  };

  const [showButton, setShowButton] = useState(true);

  return (
    <div className="flex items-center min-h-screen flex-col bg-slate-900">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-r from-green-200 to-green-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-6xl">
              Hawaii Speed Test
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              Aloha! This website was developed in partnership with the County
              of Kauai and the Kauai Economic Development Board. Its purpose is
              to inform Hawaii residents about Digital Equity and explore
              broadband community data throughout the state.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="#speedtest"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-r from-green-200 to-green-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
      <main className="flex items-center flex-col" id="speedtest">
        <div className="mx-auto max-w-2xl mt-32 sm:mt-24 lg:mt-36">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Test your connection
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              Click the button below to start an internet speed test. We do not
              store any data when you run this speedtest.
            </p>
          </div>
        </div>
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex-col mt-16 mb-48">
          {showButton && (
            <div className=" flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-lime-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button
                  onClick={runSpeedTest}
                  className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600"
                >
                  <span className="flex items-center space-x-5">
                    <BoltIcon className="h-4 w-4 text-green-300" />
                    <span className="pr-6 text-gray-100">Go</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {speedTestResults && (
            <div className="divide-y divide-gray-800">
              <div className="ml-1 h-7">
                <span id="update" className="text-xl text-gray-200">
                  Loading{" "}
                </span>
                <div
                  className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-300"
                  role="status"
                  id="spinner"
                ></div>
              </div>
              <Results {...speedTestResults} />
            </div>
          )}
        </div>
      </main>
      <div className="mb-10 w-auto">
        <div className="rounded-md border-blue-300 border-2 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-gray-200">
                This map was adapted from the University of Chicago&apos;s
                Internet Equity Initiative using U.S. Census Data, FCC Form 477,
                and Ookla Internet Speedtest data
              </p>
              <p className="mt-3 text-sm md:ml-6 md:mt-0">
                <Link
                  href="https://internetequity.uchicago.edu/resource/an-integrated-map-of-internet-access/"
                  className="whitespace-nowrap font-medium text-blue-600 hover:text-blue-400"
                >
                  Learn more
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <BroadBandMap />
      </div>
      <Contact />
      <Footer />
    </div>
  );
}
