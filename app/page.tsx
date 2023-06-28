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

import { dataLayer } from "../components/map-style";
import { updatePercentiles } from "../components/utils";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoianJlZXNlODA4IiwiYSI6ImNsajY0N3VkOTBoOXgzZHJxMzRvNWQ2ejMifQ.0BKSYohH8fYJMzi8K0zWsQ";
const MAPBOX_STYLE = "mapbox://styles/jreese808/cljd92qex000801r4fnlh083d";

type HoverInfo = {
  properties: {
    geoid: string;
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

  const onHover = useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];
    // prettier-ignore
    setHoverInfo(hoveredFeature?.toJSON());
  }, []);

  return (
    <>
      <Map
        initialViewState={{
          latitude: 20.6,
          longitude: -157.2,
          zoom: 5.5,
        }}
        style={{ width: 600, height: 400 }}
        mapStyle={MAPBOX_STYLE}
        styleDiffing
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={["broadband"]}
        onMouseMove={onHover}
      >
        <Source id={"cljd92qex000801r4fnlh083d"} type="vector">
          <Layer {...dataLayer} />
        </Source>
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BroadBandMap />
      {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {speedTestResults && (
          <div>
            <h1>Speed Test Results:</h1>
            <Results {...speedTestResults} />
            <pre>{JSON.stringify(speedTestResults, null, 2)}</pre>
            <p>Streaming Points: {speedTestResults.download}</p>
          </div>
        )}
      </div> */}
    </main>
  );
}
