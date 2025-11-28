import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { MapPin, Crosshair } from 'lucide-react';

interface LocationPickerMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialPosition?: { lat: number; lng: number };
}

export function LocationPickerMap({ onLocationSelect, initialPosition }: LocationPickerMapProps) {
    const [center, setCenter] = useState<{ lat: number; lng: number }>(
        initialPosition || { lat: 24.0231, lng: -104.6502 }
    );
    const [isLocating, setIsLocating] = useState(false);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);

    useEffect(() => {
        if (initialPosition) {
            setCenter(initialPosition);
        }
    }, [initialPosition]);

    useEffect(() => {
        // Dynamically import Leaflet
        import('leaflet').then((L) => {
            // Import CSS
            import('leaflet/dist/leaflet.css');

            const mapElement = document.getElementById('location-picker-map');
            if (!mapElement || map) return;

            // Create map
            const newMap = L.map('location-picker-map').setView([center.lat, center.lng], 13);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(newMap);

            // Handle map click
            newMap.on('click', (e: any) => {
                const { lat, lng } = e.latlng;

                // Remove old marker if exists
                if (marker) {
                    marker.remove();
                }

                // Create custom icon
                const customIcon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                // Add new marker
                const newMarker = L.marker([lat, lng], { icon: customIcon }).addTo(newMap);
                setMarker(newMarker);
                onLocationSelect(lat, lng);
            });

            setMap(newMap);

            // Cleanup
            return () => {
                newMap.remove();
            };
        });
    }, []);

    useEffect(() => {
        if (map && center) {
            map.setView([center.lat, center.lng], 13);
        }
    }, [center, map]);

    const handleGetCurrentLocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCenter(newCenter);
                    onLocationSelect(newCenter.lat, newCenter.lng);
                    setIsLocating(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsLocating(false);
                }
            );
        } else {
            setIsLocating(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Haga clic en el mapa para seleccionar la ubicación del bache</span>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                >
                    <Crosshair className="w-4 h-4 mr-2" />
                    {isLocating ? 'Ubicando...' : 'Usar Mi Ubicación'}
                </Button>
            </div>

            <div
                id="location-picker-map"
                className="h-32 md:h-64 rounded-lg overflow-hidden border-2 border-gray-300"
                style={{ height: '32rem' }}
            ></div>
        </div>
    );
}