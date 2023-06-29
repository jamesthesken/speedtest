"use client";
//import { useEffect, useState } from "react";
import Image from "next/image";
import SpeedTest from "@cloudflare/speedtest";
import Results from "../components/results";

//import * as React from 'react';
//import {render} from 'react-dom';
//import Map from 'react-map-gl';

import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { render } from "react-dom";
import Map, { Source, Layer, FillLayer } from "react-map-gl";
import ControlPanel from "../components/control-panel";

// import { dataLayer } from "../components/map-style";
import { updatePercentiles } from "../components/utils";

import { useForm } from "react-hook-form";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoianJlZXNlODA4IiwiYSI6ImNsajY0N3VkOTBoOXgzZHJxMzRvNWQ2ejMifQ.0BKSYohH8fYJMzi8K0zWsQ";
const MAPBOX_STYLE = "mapbox://styles/jreese808/cljd92qex000801r4fnlh083d";

type HoverInfo = {
  properties: {
    geoid: string;
    d_mbps: number;
    devices: number;
    devices_per_cap: number;
    f_asian: number;
    f_ba: number;
    f_black: number;
    f_broadband: number;
    f_computer: number;
    f_hawaiian: number;
    f_hispanic: number;
    f_white: number;
    fiber_100u_exists: number;
    households: number;
    lat_ms: number;
    log_mhi: number;
    max_dn: number;
    max_up: number;
    mhi: number;
    n_dn10: number;
    n_dn100: number;
    n_dn250: number;
    n_fiber_100u: number;
    n_isp: number;
    population: number;
    tests: number;
    tests_per_cap: number;
    u_mbps: number;
  };
};

export function BroadBandMap() {
  const [mapStyle, setMapStyle] = useState(null);
  const [allData, setAllData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>();
  const [settings, setSettings] = useState({
    scrollZoom: true,
    dragRotate: false,
    keyboard: false,
    doubleClickZoom: true,
    touchZoomRotate: false,
    touchPitch: false,
    minZoom: 5.01,
    maxZoom: 15,
    maxBounds: [
      [-167.2, 15.8], //Southwest
      [-147.2, 25.6],
    ], //Northeast
  });

  const mapProperties = {
    f_broadband: {
      feature: "f_broadband",
      name: "Broadband Access",
      description: "Frac. of Households with Broadband Subscription",
      colorStops: [
        [60, "#800000"],
        [70, "#b81414"],
        [80, "#d13400"],
        [90, "#ffcd38"],
        [100, "#ffff33"],
      ],
    },
    f_computer: {
      feature: "f_computer",
      name: "Computer in HH",
      description: "% of Households</br>with a Computer",
      colorStops: [
        [60, "#800000"],
        [70, "#b81414"],
        [80, "#d13400"],
        [90, "#ffcd38"],
        [100, "#ffff33"],
      ],
    },
    f_ba: {
      feature: "f_ba",
      name: "% College Grads",
      description: "% of Adult</br>Population with a BA",
      colorStops: [
        [0, "#800000"],
        [25, "#b81414"],
        [50, "#d13400"],
        [75, "#ffcd38"],
        [100, "#ffff33"],
      ],
    },
    f_hawaiian: {
      feature: "f_hawaiian",
      name: "% Hawaiian",
      description: "Share of Population</br>that is Hawaiian",
      colorStops: [
        [0, "#800000"],
        [25, "#b81414"],
        [50, "#d13400"],
        [75, "#ffcd38"],
        [100, "#ffff33"],
      ],
    },
    log_mhi: {
      feature: "log_mhi",
      name: "Log Income",
      description: "Log. of Median Household Income",
      colorStops: [
        [10, "#800000"],
        [10.5, "#b81414"],
        [11, "#d13400"],
        [11.5, "#ffcd38"],
        [12, "#ffff33"],
      ],
    },
    n_isp: {
      feature: "n_isp",
      name: "# of ISPs",
      description: "Number of ISPs",
      colorStops: [
        [0, "#800000"],
        [1, "#b81414"],
        [2, "#d13400"],
        [3, "#ffcd38"],
        [4, "#ffff33"],
      ],
    },
    n_dn10: {
      feature: "n_dn10",
      name: "ISPs @ 10 Mbps",
      description: "# of ISPs with &gt; 10 Mbps Downstream",
      colorStops: [
        [0, "#800000"],
        [1, "#b81414"],
        [2, "#d13400"],
        [3, "#ffcd38"],
        [4, "#ffff33"],
      ],
    },
    n_dn100: {
      feature: "n_dn100",
      name: "ISPs @ 100 Mbps",
      description: "# of ISPs with &gt; 100 Mbps Downstream",
      colorStops: [
        [0, "#800000"],
        [1, "#b81414"],
        [2, "#d13400"],
        [3, "#ffcd38"],
        [4, "#ffff33"],
      ],
    },
    n_dn250: {
      feature: "n_dn250",
      name: "ISPs @ 250 Mbps",
      description: "# of ISPs with &gt; 250 Mbps Downstream",
      colorStops: [
        [0, "#800000"],
        [1, "#b81414"],
        [2, "#d13400"],
        [3, "#ffcd38"],
        [4, "#ffff33"],
      ],
    },
    n_fiber_100u: {
      feature: "n_fiber_100u",
      name: "Fiber ISPs @ 100 Up",
      description: "# Fiber Offerings with Upstream &gt; 100 Mbps",
      colorStops: [
        [0, "#800000"],
        [1, "#b81414"],
        [2, "#d13400"],
        [3, "#ffcd38"],
        [4, "#ffff33"],
      ],
    },
    fiber_100u_exists: {
      feature: "fiber_100u_exists",
      name: "Fiber Availability",
      description: "Share of Blocks with Fiber",
      colorStops: [
        [0, "#800000"],
        [0.25, "#b81414"],
        [0.50, "#d13400"],
        [0.75, "#ffcd38"],
        [1.00, "#ffff33"],
      ],
    },
    max_dn: {
      feature: "max_dn",
      name: "Max Adv. Downstream",
      description: "Max Available</br>Downstream Speed",
      colorStops: [
        [0, "#800000"],
        [25, "#b81414"],
        [100, "#d13400"],
        [500, "#ffcd38"],
        [1000, "#ffff33"],
      ],
    },
    max_up: {
      feature: "max_up",
      name: "Max Adv. Upstream",
      description: "Max Available</br>Upstream Speed",
      colorStops: [
        [0, "#800000"],
        [25, "#b81414"],
        [100, "#d13400"],
        [500, "#ffcd38"],
        [1000, "#ffff33"],
      ],
    },
    d_mbps: {
      feature: "d_mbps",
      name: "Avg. Download Rate",
      description: "Average Fixed-Line Downstream Speed [Mbps]",
      colorStops: [
        [0, "#800000"],
        [25, "#b81414"],
        [100, "#d13400"],
        [200, "#ffcd38"],
        [300, "#ffff33"],
      ],
    },
    u_mbps: {
      feature: "u_mbps",
      name: "Avg. Upload Rate",
      description: "Average Fixed-Line Upstream Speed [Mbps]",
      colorStops: [
        [0, "#800000"],
        [10, "#b81414"],
        [30, "#d13400"],
        [50, "#ffcd38"],
        [150, "#ffff33"],
      ],
    },
    lat_ms: {
      feature: "lat_ms",
      name: "Avg. Latency",
      description: "Average Fixed-Line</br>Latency [ms]",
      colorStops: [
        [0, "#800000"],
        [10, "#b81414"],
        [25, "#d13400"],
        [50, "#ffcd38"],
        [100, "#ffff33"],
      ],
    },
    tests_per_cap: {
      feature: "tests_per_cap",
      name: "Tests per Capita",
      description: "Ookla Tests, Per Capita",
      colorStops: [
        [0, "#800000"],
        [0.01, "#b81414"],
        [0.025, "#d13400"],
        [0.05, "#ffcd38"],
        [0.1, "#ffff33"],
      ],
    },
    devices_per_cap: {
      feature: "devices_per_cap",
      name: "Devices per Capita",
      description: "Devices Running Ookla Tests, Per Capita",
      colorStops: [
        [0, "#800000"],
        [0.01, "#b81414"],
        [0.02, "#d13400"],
        [0.03, "#ffcd38"],
        [0.05, "#ffff33"],
      ],
    },
  };

  const [mapLayer, setMapLayer] = useState(mapProperties["f_broadband"]);

  useEffect(() => {
    console.log(mapLayer);
  }, [mapLayer]);

  const dataLayer: FillLayer = {
    id: "broadband",
    type: "fill",
    source: "mapbox",
    "source-layer": "broadband",
    paint: {
      "fill-color": {
        property: mapLayer.feature,
        stops: mapLayer.colorStops,
      },
      "fill-opacity": 0.8,
    },
  };

  const onHover = useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];
    // prettier-ignore
    setHoverInfo(hoveredFeature?.toJSON());
  }, []);

  const { register, handleSubmit } = useForm();

  return (
    <>
      <Map
        initialViewState={{
          latitude: 20.6,
          longitude: -157.2,
          zoom: 5.5,
        }}
        style={{ width: "100%", height: 520 }}
        mapStyle={MAPBOX_STYLE}
        styleDiffing
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={["broadband"]}
        onMouseMove={onHover}
      >
        <Source id={"cljd92qex000801r4fnlh083d"} type="vector">
          <Layer {...dataLayer} />
        </Source>
        <form className="absolute top-0 bg-gray-700 h-full w-80 p-8">
          <label className="text-base font-semibold text-gray-300">
            Metrics Tract: {hoverInfo?.properties.geoid}
          </label>
          <fieldset className="mt-4">
            <legend className="sr-only">Notification method</legend>
            {Object.keys(mapProperties).map((keyName, i) => (
              <div key={i} className="flex items-center">
                <input
                  name="metrics-name"
                  type="radio"
                  value={
                    mapProperties[keyName as keyof typeof mapProperties].feature
                  }
                  onChange={(e) =>
                    setMapLayer(
                      mapProperties[
                        e.target.value as keyof typeof mapProperties
                      ]
                    )
                  }
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor={
                    mapProperties[keyName as keyof typeof mapProperties].name
                  }
                  className="ml-3 block text-sm font-medium leading-6 text-gray-300"
                >
                  {mapProperties[keyName as keyof typeof mapProperties].name}
                </label>
                <label>
                  {
                    hoverInfo?.properties[
                      mapProperties[keyName as keyof typeof mapProperties]
                        .feature as keyof typeof mapProperties
                    ]
                  }
                </label>
              </div>
            ))}
          </fieldset>
          {/* <select
            {...register("layer")}
            onChange={(e) =>
              setMapLayer(
                mapProperties[e.target.value as keyof typeof mapProperties]
              )
            }
          >
            <option key="f_broadband" value="f_broadband">
              Broadband
            </option>
            <option key="tests_per_cap" value="tests_per_cap">
              Tests
            </option>
          </select> */}
        </form>
        {hoverInfo && (
          <div className="tooltip">
            <div>Geo ID: {hoverInfo.properties.geoid}</div>
          </div>
        )}
      </Map>
    </>
  );
} //<ControlPanel onChange={setMapStyle} />

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
};

export default function Home() {
  const [speedTestResults, setSpeedTestResults] = useState<any>();

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
      const summary = engine.results.getSummary();
      const scores = engine.results.getScores();
      setSpeedTestResults({ ...scores, ...summary, ...meta, ...ts, ...ua });
    };

    engine.onFinish = (results) => {
      const summary = results.getSummary();
      const scores = results.getScores();
      setSpeedTestResults({ ...scores, ...summary, ...meta, ...ts, ...ua });
      console.log({ ...scores, ...summary, ...meta, ...ts, ...ua });
      const finishedElement = document.createElement("div");
      finishedElement.id = "speedtest-finished";
      document.body.appendChild(finishedElement);
    };

    console.log("running");

    engine.play();
  };

  useEffect(() => {
    runSpeedTest();
  }, []);

  return (
    <div className="flex w-full">
      <BroadBandMap />
    </div>
    // <main className="flex">

    //   {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
    //     {speedTestResults && (
    //       <div>
    //         <h1>Speed Test Results:</h1>
    //         <Results {...speedTestResults} />
    //         <pre>{JSON.stringify(speedTestResults, null, 2)}</pre>
    //         <p>Streaming Points: {speedTestResults.download}</p>
    //       </div>
    //     )}
    //   </div> */}
    // </main>
  );
}
