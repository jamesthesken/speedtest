"use client";
//import { useEffect, useState } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import Map, { Source, Layer, FillLayer } from "react-map-gl";
import { LngLat, LngLatBounds } from "mapbox-gl";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoianJlZXNlODA4IiwiYSI6ImNsajY0N3VkOTBoOXgzZHJxMzRvNWQ2ejMifQ.0BKSYohH8fYJMzi8K0zWsQ";
const MAPBOX_STYLE = "mapbox://styles/jreese808/cljna4uvl002k01r39caj94a8";

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

// Geographical bounding box: https://docs.mapbox.com/mapbox-gl-js/api/geography/#lnglatbounds
const sw = new LngLat(-167.2, 15.8);
const ne = new LngLat(-147.2, 25.6);

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
    maxBounds: new LngLatBounds(sw, ne),
  });

  const mapProperties = {
    f_broadband: {
      feature: "f_broadband",
      name: "Broadband Access",
      description: "% of Households with Broadband Subscription",
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
      description: "% of Households with a Computer",
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
      description: "% of Adult Population with a BA",
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
      name: "% Native Hawaiian",
      description: "Share of Population that is Native Hawaiian",
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
      description: "# of ISPs with > 10 Mbps Downstream",
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
      description: "# of ISPs with > 100 Mbps Downstream",
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
      description: "# of ISPs with > 250 Mbps Downstream",
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
      description: "# Fiber Offerings with Upstream > 100 Mbps",
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
        [0.5, "#d13400"],
        [0.75, "#ffcd38"],
        [1.0, "#ffff33"],
      ],
    },
    max_dn: {
      feature: "max_dn",
      name: "Max Adv. Downstream",
      description: "Max Available Downstream Speed",
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
      description: "Max Available Upstream Speed",
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
      description: "Average Fixed-Line Latency [ms]",
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

  const [mapLayer, setMapLayer] = useState(mapProperties["d_mbps"]);

  useEffect(() => {
    console.log(mapLayer);
  }, [mapLayer]);

  const dataLayer: FillLayer = {
    id: "broadband",
    type: "fill",
    // source: "mapbox",
    "source-layer": "original",
    paint: {
      "fill-color": {
        property: mapLayer.feature,
        stops: mapLayer.colorStops,
      },
      "fill-opacity": 0.7,
    },
  };

  const highlightLayer: FillLayer = {
    id: "broadband-highlighted",
    type: "fill",
    source: "broadband",
    "source-layer": "original",
    paint: {
      "fill-color": {
        property: mapLayer.feature,
        stops: mapLayer.colorStops,
      },
      "fill-outline-color": "#000000",
      // 'fill-opacity': 1,
    },
  };

  // TODO: update this with react-map-gl types. Cant find it at the moment https://github.com/visgl/react-map-gl/blob/2c8951c93ba734b38b85d99a6ea5ed38d6e470d0/docs/api-reference/types.md
  const onHover = useCallback((event: any) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];
    // prettier-ignore
    if (hoveredFeature?.toJSON() != undefined){
      setHoverInfo(hoveredFeature?.toJSON());
    }
  }, []);

  const selectedCounty = (hoverInfo && hoverInfo.properties.geoid) || "";
  const filter = useMemo(
    () => ["in", "geoid", selectedCounty],
    [selectedCounty]
  );

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full">
      <div className="basis-1/4">
        <form className="bg-slate-800 h-full p-8 pt-16 lg:p-8">
          <label className="text-base font-semibold text-gray-300">
            Tract: {hoverInfo?.properties.geoid}
          </label>
          <div className="flex-row">
            <div className="bg-[#800000]"></div>
            <div className="bg-[#b81414]"></div>
            <div className="bg-[#d13400]"></div>
            <div className="bg-[#ffcd38]"></div>
            <div className="bg-[#ffff33]"></div>
          </div>
          <fieldset className="mt-4">
            <legend className="sr-only">Broadband data metrics</legend>
            {Object.keys(mapProperties).map((keyName, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex flex-row items-center justify-between">
                  <label className="ml-2 block text-sm font-medium leading-6 text-gray-300">
                    <input
                      name="metrics-name"
                      type="radio"
                      value={
                        mapProperties[keyName as keyof typeof mapProperties]
                          .feature
                      }
                      defaultChecked={
                        mapProperties[keyName as keyof typeof mapProperties]
                          .feature == "d_mbps"
                      }
                      onChange={(e) =>
                        setMapLayer(
                          mapProperties[
                            e.target.value as keyof typeof mapProperties
                          ]
                        )
                      }
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />{" "}
                    {mapProperties[keyName as keyof typeof mapProperties].name}
                  </label>
                  <label className="">
                    {
                      hoverInfo?.properties[
                        mapProperties[keyName as keyof typeof mapProperties]
                          .feature as keyof typeof mapProperties
                      ]
                    }
                  </label>
                </div>
                {mapLayer.feature ===
                  mapProperties[keyName as keyof typeof mapProperties]
                    .feature && (
                  <div className="ml-4">
                    <label>
                      {
                        mapProperties[keyName as keyof typeof mapProperties]
                          .description
                      }
                    </label>
                    <div className="flex flex-row">
                      {mapProperties[
                        keyName as keyof typeof mapProperties
                      ].colorStops.map((colors, index) => (
                        <div key={index} className="flex flex-col">
                          <div className={`bg-[${colors[1]}] w-9 h-4`}></div>
                          <span className="text-xs flex justify-center">
                            {colors[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </fieldset>
        </form>
      </div>
      <div className="grow">
        <Map
          initialViewState={{
            latitude: 20.6,
            longitude: -157.2,
            zoom: 5.5,
          }}
          {...settings}
          style={{ width: "100%", height: 600 }}
          mapStyle={MAPBOX_STYLE}
          styleDiffing
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={["broadband"]}
          onMouseMove={onHover}
        >
          <Source type="vector" url="jreese808.ce9n8i6v">
            {/* id={"cljd92qex000801r4fnlh083d"} */}

            <Layer {...dataLayer} />
            <Layer {...highlightLayer} filter={filter} />
          </Source>
        </Map>
      </div>
    </div>
  );
}
