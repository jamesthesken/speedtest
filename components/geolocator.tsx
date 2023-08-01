import { useEffect } from "react";
import { useGeolocation } from "react-use";
import { GeoLocationSensorState } from "react-use/lib/useGeolocation";

type Props = {
  setLocation: (fill: GeoLocationSensorState) => void;
}

export default function Geolocator({setLocation}: Props){
  const location = useGeolocation();
  useEffect (() => {
    setLocation(location);
  },[location]);
  return(null);
}