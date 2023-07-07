"use-client";
import { useEffect } from "react";
import { SpeedTestResults } from "@/app/page";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

function formatBytes(bits: number, decimals = 2) {
  if (!+bits) return "0 Bits";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bits", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bits) / Math.log(k));

  return `${parseFloat((bits / Math.pow(k, i)).toFixed(dm))}`;
}
export default function Results(speedTestResults: SpeedTestResults) {
  useEffect(() => {
    if (speedTestResults?.download) {
      formatBytes(speedTestResults?.download);
    }
  }, [speedTestResults]);

  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-rows-1 gap-px bg-white/5">
          <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-gray-400">
                Download Speed
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                {speedTestResults?.download ? (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {formatBytes(speedTestResults?.download)}
                  </span>
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    --
                  </span>
                )}
                <span className="text-sm text-gray-400">Mbps</span>
              </p>
            </div>
            <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-gray-400">
                Upload Speed
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                {speedTestResults?.upload ? (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {formatBytes(speedTestResults?.upload)}
                  </span>
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    --
                  </span>
                )}
                <span className="text-sm text-gray-400">Mbps</span>
              </p>
            </div>
            <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-gray-400">
                Latency
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                {speedTestResults?.latency ? (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {formatBytes(speedTestResults?.latency)}
                  </span>
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    --
                  </span>
                )}
                <span className="text-sm text-gray-400">ms</span>
              </p>
            </div>
            <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-gray-400">
                Jitter
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                {speedTestResults?.jitter ? (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {formatBytes(speedTestResults?.jitter)}
                  </span>
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    --
                  </span>
                )}
                <span className="text-sm text-gray-400">ms</span>
              </p>
            </div>
          </div>
          <div className="flex flex-row bg-slate-900 p-8">
            <h1>Network Quality Scores</h1>
            <div className="group relative w-max pl-8">
              <InformationCircleIcon className="text-gray-100 h-5 w-5" />
              <span className="pointer-events-none bg-gray-700 w-96 absolute -top-7 left-0 opacity-0 transition-opacity group-hover:opacity-100 rounded-lg p-8">
                Aggregated Internet Measurement (AIM) helps you understand your
                Internet quality to identify scenarios that your Internet
                connection is good or bad for. Typically, an Internet speed test
                provides you with upload and download speeds, which may not
                always provide a holistic view of your Internet quality.
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex flex-row justify-between">
                <p className="text-sm font-medium leading-6 text-gray-400">
                  {speedTestResults?.streaming ? (
                    <span>{speedTestResults?.streaming.points} points</span>
                  ) : (
                    <span>--</span>
                  )}
                </p>
                <div></div>
              </div>

              <p className="mt-2 flex items-baseline gap-x-2">
                {speedTestResults?.streaming ? (
                  <span className="text-2xl font-semibold tracking-tight text-white">
                    {speedTestResults?.streaming.classificationName} for video
                    streaming
                  </span>
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    --
                  </span>
                )}
              </p>
            </div>
            <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-gray-400">
                {speedTestResults?.gaming ? (
                  <span>{speedTestResults?.gaming.points} points</span>
                ) : (
                  <span>--</span>
                )}
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                {speedTestResults?.gaming ? (
                  <span className="text-2xl font-semibold tracking-tight text-white">
                    {speedTestResults?.gaming.classificationName} for gaming
                  </span>
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    --
                  </span>
                )}
              </p>
            </div>
            <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-gray-400">
                {speedTestResults?.rtc ? (
                  <span>{speedTestResults?.rtc.points} points</span>
                ) : (
                  <span>--</span>
                )}
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                {speedTestResults?.rtc ? (
                  <span className="text-2xl font-semibold tracking-tight text-white">
                    {speedTestResults?.rtc.classificationName} for video
                    chatting
                  </span>
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    --
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <br></br>

      <div className="mx-auto max-w-7xl">
        <h1 className="pb-2">Details</h1>
        <div className="grid grid-rows-1 divide-y-2 divide-gray-200 gap-px bg-white/5 p-4 items-center">
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-2">
            <p>Downloaded Latency</p>
            <p className="mt-2 flex gap-x-2">
              {speedTestResults?.downLoadedLatency} ms
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px  sm:grid-cols-2 lg:grid-cols-2">
            <p>Downloaded Jitter</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              {speedTestResults?.downLoadedJitter} ms
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-2">
            <p>Uploaded Latency</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              {speedTestResults?.upLoadedLatency} ms
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px  sm:grid-cols-2 lg:grid-cols-2">
            <p>Uploaded Jitter</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              {speedTestResults?.upLoadedJitter} ms
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-2">
            <p>Packet Loss</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              {speedTestResults?.packetLoss}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-2">
            <p>Date</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              {speedTestResults?.dateTime}
            </p>
          </div>
          <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-sm font-medium leading-6 text-gray-400">
              Upload Speed
            </p>
            <p className="mt-2 flex items-baseline gap-x-2">
              {speedTestResults?.upload ? (
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {formatBytes(speedTestResults?.upload)}
                </span>
              ) : (
                <span className="text-4xl font-semibold tracking-tight text-white">
                  --
                </span>
              )}
              <span className="text-sm text-gray-400">mbps</span>
            </p>
          </div>
          <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-sm font-medium leading-6 text-gray-400">
              Latency
            </p>
            <p className="mt-2 flex items-baseline gap-x-2">
              {speedTestResults?.latency ? (
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {formatBytes(speedTestResults?.latency)}
                </span>
              ) : (
                <span className="text-4xl font-semibold tracking-tight text-white">
                  --
                </span>
              )}
              <span className="text-sm text-gray-400">mbps</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
