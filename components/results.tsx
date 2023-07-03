"use-client";
import { useEffect } from "react";
import { SpeedTestResults } from "@/app/page";

function formatBytes(bits: number, decimals = 2) {
  if (!+bits) return "0 Bits";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bits", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bits) / Math.log(k));
  console.log(`${parseFloat((bits / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`);

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
                <span className="text-sm text-gray-400">mbps</span>
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

        <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">

          <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm font-medium leading-6 text-gray-400">
                {speedTestResults?.streaming ? (
                  <span>{speedTestResults?.streaming.points} points</span>
                ) : (
                  <span>--</span>
                )}
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                {speedTestResults?.streaming ? (
                  <span className="text-2xl font-semibold tracking-tight text-white">
                    {speedTestResults?.streaming.classificationName} for streaming
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
                    {speedTestResults?.rtc.classificationName} for live comms
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
    </div>
  );
}
