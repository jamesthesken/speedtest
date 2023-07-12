import { useGeolocation } from "react-use";

export default function Geolocator({getLocation}){
    const location = useGeolocation();
    getLocation(location);
    return(null);
}