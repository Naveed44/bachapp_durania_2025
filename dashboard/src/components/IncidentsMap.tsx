import { useEffect, useState } from 'react';
import type { IncidentReport } from '../App';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';

interface IncidentsMapProps {
    reports: IncidentReport[];
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'low':
            return 'bg-green-100 text-green-800 border-green-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
};

export function IncidentsMap({ reports }: IncidentsMapProps) {
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);

    // Filter reports that have coordinates
    const reportsWithCoordinates = reports.filter(report => report.coordinates);

    // Calculate center of map based on all incident locations
    const center = reportsWithCoordinates.length > 0
        ? {
            lat: reportsWithCoordinates.reduce((sum, r) => sum + (r.coordinates?.lat || 0), 0) / reportsWithCoordinates.length,
            lng: reportsWithCoordinates.reduce((sum, r) => sum + (r.coordinates?.lng || 0), 0) / reportsWithCoordinates.length,
        }
        : { lat: 40.7128, lng: -74.0060 };

    useEffect(() => {
        if (reportsWithCoordinates.length === 0) return;

        // Dynamically import Leaflet
        import('leaflet').then((L) => {
            // Import CSS
            import('leaflet/dist/leaflet.css');

            const mapElement = document.getElementById('incidents-map');
            if (!mapElement) return;

            // Remove old map if exists
            if (map) {
                map.remove();
            }

            // Create map
            const newMap = L.map('incidents-map').setView([center.lat, center.lng], 12);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(newMap);

            // Create colored markers for different severity levels
            const createColoredIcon = (color: string) => {
                return L.divIcon({
                    className: 'custom-div-icon',
                    html: `
            <div style="
              background-color: ${color};
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              border: 3px solid white;
              transform: rotate(-45deg);
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">
              <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(45deg);
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
            </div>
          `,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30],
                });
            };

            const highIcon = createColoredIcon('#ef4444');
            const mediumIcon = createColoredIcon('#eab308');
            const lowIcon = createColoredIcon('#22c55e');

            const getMarkerIcon = (priority: string) => {
                switch (priority) {
                    case 'high':
                        return highIcon;
                    case 'medium':
                        return mediumIcon;
                    case 'low':
                        return lowIcon;
                    default:
                        return lowIcon;
                }
            };

            // Add markers
            const newMarkers: any[] = [];
            reportsWithCoordinates.forEach((report) => {
                const marker = L.marker(
                    [report.coordinates!.lat, report.coordinates!.lng],
                    { icon: getMarkerIcon(report.priority) }
                ).addTo(newMap);

                // Create popup content
                const popupContent = `
          <div class="p-2">
            <div class="flex items-center justify-between mb-2">
              <span class="inline-flex items-center px-2 py-1 rounded-md text-xs ${getPriorityColor(report.priority).replace('border-', 'border ')}">${report.priority.toUpperCase()}</span>
              <span class="text-xs text-gray-500">${formatDate(report.timestamp)}</span>
            </div>
            <div class="flex items-start gap-1 mb-2">
              <p class="text-sm text-gray-700">${report.location}</p>
            </div>
            <p class="text-sm text-gray-600 mb-2" style="max-width: 250px;">${report.description}</p>
            ${report.photos.length > 0 ? `
              <div class="flex gap-1 overflow-x-auto">
                ${report.photos.slice(0, 3).map((photo, index) => `
                  <img src="${photo}" alt="Incident photo ${index + 1}" class="w-16 h-16 object-cover rounded" />
                `).join('')}
                ${report.photos.length > 3 ? `
                  <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                    +${report.photos.length - 3}
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `;

                marker.bindPopup(popupContent, { maxWidth: 300 });
                newMarkers.push(marker);
            });

            setMarkers(newMarkers);
            setMap(newMap);
        });

        return () => {
            // Cleanup markers
            markers.forEach(m => m.remove());
            if (map) {
                map.remove();
            }
        };
    }, [reports]);

    if (reportsWithCoordinates.length === 0) {
        return (
            <div className="h-96 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No hay bache con datos de ubicación aún</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Los reportes con ubicaciones aparecerán aquí
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            id="incidents-map"
            className="h-64 min-h-64 md:h-64 rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm"
            style={{ height: '32rem' }}
        ></div>
    );
}