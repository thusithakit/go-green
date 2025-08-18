'use client'
import { database } from "@/app/lib/firebase-realtime";
import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import { ArrowBigRight } from "lucide-react";


interface Bin {
    id: string;
    lat: number;
    lng: number;
    isOpen: boolean;
    level: number;
}

const mapContainerStyle = { width: "100%", height: "100%" };
let center = { lat: 6.9271, lng: 79.8612 };
let userLocation: { lat: number; lng: number; } | null = null;

const levelMarker = (level: number) => {
    let imgUrl = ""
    switch (true) {
        case (level >= 80):
            imgUrl = "/marker-red.png";
            break;
        case (level >= 65):
            imgUrl = "/marker-orange.png";
            break;
        case (level >= 45):
            imgUrl = "/marker-yellow.png";
            break;
        default:
            imgUrl = "/marker-green.png";
            break;
    }
    return imgUrl;
}

const getUserLocation = ()=>{
    console.log("center coordinates",center)
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (position)=>{
                const {latitude, longitude} = position.coords;
                center ={lat:latitude,lng:longitude}
                userLocation ={lat:latitude,lng:longitude}
                console.log("center coordinates",center)
            },
            (error)=>{
                console.error("Error getting user location",error);
            }
        );
    }
    else{
        console.error('Geolocation is not supported by this browser.');
    }
}

const BinMap = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    });
    
    const [bins, setBins] = useState<Bin[]>([]);
    const [selectedBin, setSelectedBin] = useState<Bin | null>(null);

    useEffect(() => {
        const binRef = ref(database, "/bins");
        const unsubscribe = onValue(binRef, (snapshot) => {
            if (snapshot.exists()) {
                const binsData = snapshot.val();
                const binsArray = Object.keys(binsData).map((key) => ({
                    id: key,
                    ...binsData[key],
                }));
                setBins(binsArray);
            } else {
                setBins([]);
            }
        });
        getUserLocation();
        return () => unsubscribe();
    }, []);
    if (!isLoaded) return <LoadingIndicator/>;
    return (
        <div className="relative h-[100vh] pt-[70px]">
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={center}>
                {userLocation && (
                    <Marker position={{ lat: userLocation.lat, lng: userLocation.lng }}
                        icon={{
                            url:"/user-pin.svg",
                            scaledSize: new window.google.maps.Size(30, 30),
                        }}
                    />
                )}
                {Array.isArray(bins) && bins.map((bin) => (
                    <Marker key={bin.id} position={{ lat: bin.lat, lng: bin.lng }}
                        icon={{
                            url: bin.isOpen ? "/marker-open.png" : levelMarker(bin.level),
                            scaledSize: new window.google.maps.Size(30, 30),
                        }}
                        onClick={() => setSelectedBin(bin)}
                    />
                ))}
                {selectedBin && (
                    <InfoWindow
                    position={{ lat: selectedBin.lat, lng: selectedBin.lng }}
                    onCloseClick={() => setSelectedBin(null)}
                    >
                    <div className="p-2">
                        <h3 className="font-bold text-xl mb-1">Bin Info</h3>
                        <p>Current fill level: {selectedBin.level}%</p>
                        {
                            selectedBin.level < 85 && (
                                <button
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded w-full text-xl"
                                    onClick={() =>
                                        window.open(
                                        `https://www.google.com/maps?q=${selectedBin.lat},${selectedBin.lng}`,
                                        "_blank"
                                        )
                                    }
                                >
                                    Navigate
                                </button>
                            )
                        }
                        {selectedBin.level >= 80 &&(
                            <p className="text-sm text-gray-500 italic mt-2">
                                <b>Note:</b> This bin is almost full, please consider using another bin.
                            </p>
                        )}
                    </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    )

}

export default BinMap