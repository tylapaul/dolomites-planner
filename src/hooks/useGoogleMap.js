import { useEffect, useRef, useState, useCallback } from 'react';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let isLoading = false;
let isLoaded = false;
const callbacks = [];

function loadGoogleMaps() {
  if (isLoaded) return Promise.resolve();
  if (isLoading) return new Promise((res) => callbacks.push(res));
  isLoading = true;
  return new Promise((res, rej) => {
    callbacks.push(res);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places,directions`;
    script.async = true;
    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      callbacks.forEach((cb) => cb());
      callbacks.length = 0;
    };
    script.onerror = rej;
    document.head.appendChild(script);
  });
}

export function useGoogleMap(containerRef, initialCenter) {
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!containerRef.current || mapRef.current) return;
      mapRef.current = new window.google.maps.Map(containerRef.current, {
        center: initialCenter,
        zoom: 10,
        mapTypeId: 'terrain',
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1a2332' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#e8d5a0' }] },
          { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9a84c' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c3e50' }] },
          { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#c9a84c' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a3a5c' }] },
          { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4fa3e0' }] },
          { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#1e3d2f' }] },
          { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1e3d2f' }] },
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });
      setReady(true);
    });
  }, []);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
  }, []);

  const addMarker = useCallback((position, options = {}) => {
    if (!mapRef.current) return null;
    const marker = new window.google.maps.Marker({
      position,
      map: mapRef.current,
      ...options,
    });
    markersRef.current.push(marker);
    return marker;
  }, []);

  const panTo = useCallback((coords, zoom) => {
    if (!mapRef.current) return;
    mapRef.current.panTo(coords);
    if (zoom) mapRef.current.setZoom(zoom);
  }, []);

  const drawRoute = useCallback((origin, destination, waypoints = []) => {
    if (!mapRef.current || !window.google) return;
    const ds = new window.google.maps.DirectionsService();
    const dr = new window.google.maps.DirectionsRenderer({
      map: mapRef.current,
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#c9a84c', strokeWeight: 3, strokeOpacity: 0.8 },
    });
    ds.route(
      {
        origin,
        destination,
        waypoints: waypoints.map((w) => ({ location: w, stopover: false })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') dr.setDirections(result);
      }
    );
    if (polylineRef.current) polylineRef.current.setMap(null);
    polylineRef.current = dr;
  }, []);

  return { map: mapRef.current, ready, clearMarkers, addMarker, panTo, drawRoute };
}
