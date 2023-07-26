import { SpeedTestResults } from "@/app/page";
import { useEffect, useState } from "react";

export default function Service(speedTestResults: SpeedTestResults, isFinished: boolean){

  const serviceScore = {
    error: {
      name: "error",
      down: "error",
      up: "error",
      opt: "or",
    },
    unserved: {
      name: "Unserved",
      down: "less than 25 mbps",
      up: "less than 3 mbps",
      opt: "or",
      emoji: "🆘",
    },
    underserved: {
      name: "Underserved",
      down: "less than 100 mbps",
      up: "less than 20 mbps",
      opt: "or",
      emoji: "⚠️",
    },
    served: {
      name: "Well served",
      down: "100 mbps or greater",
      up: "20 mbps or greater",
      opt: "and",
      emoji: "👍",
    },
  };

  const [score, setScore] = useState<any>(serviceScore.error);

  useEffect (() => {
    if (speedTestResults?.download && speedTestResults?.upload){
      if (speedTestResults.download < 25000000 || speedTestResults.upload < 3000000){
        setScore (serviceScore.unserved);
      } else if (speedTestResults.download < 100000000 || speedTestResults.upload < 20000000){
        setScore (serviceScore.underserved);
      } else if (speedTestResults.download >= 100000000 || speedTestResults.upload >= 20000000){
        setScore (serviceScore.served);
      }
    }
  },[isFinished]);

  return (
    <div className="py-10 text-center items-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">You are {score.name} {score.emoji}</h1>
      <p className="mt-6 text-lg leading-8 text-gray-200">
        The FCC considers households with download speeds of {score.down} {score.opt} upload speeds of {score.up} to be {score.name}. 
        If you or someone you know is unserved or underserved, you can:
      </p>
      <div className="mt-6 text-lg leading-8 text-gray-200">
        <ul>
          <li>🔥 Report a challenge on your household to the FCC{" "}
            <a 
              href="https://help.bdc.fcc.gov/hc/en-us/articles/10475216120475-How-to-Submit-a-Location-Challenge-"
              className="whitespace-nowrap font-medium text-blue-400 hover:text-blue-200 mt-6"
              target="_blank"
            >
              HERE 🔥
            </a>
          </li>
          <li>💯  Go to the UH broadband initiative website{" "}
            <a 
              href="https://www.hawaii.edu/broadband/"
              className="whitespace-nowrap font-medium text-blue-400 hover:text-blue-200 mt-6"
              target="_blank"
            >
              HERE 💯 
            </a>
          </li>
          <li>📈 Check out how to improve internet speed{" "}
            <a 
              href="https://www.fcc.gov/consumers/guides/broadband-speed-guide"
              className="whitespace-nowrap font-medium text-blue-400 hover:text-blue-200 mt-6"
              target="_blank"
            >
              HERE 📈
            </a>
          </li>
        </ul>
      </div>
    </div>
          );
};