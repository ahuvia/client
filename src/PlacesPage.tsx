import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from 'react-query';
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from "react-chartjs-2";
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Paper } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { Place } from "./types";
import { extractCoordinates } from "./utile";
import AxiosInstance from "./axiosInstance";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Fetch places function
const fetchPlaces = async () => {
  const response = await AxiosInstance.get("/place");
  return response.data.map((place: any) => {
    const { latitude, longitude } = extractCoordinates(place.address);
    return { ...place, latitude, longitude };
  });
};

// Fetch weather function
const fetchWeather = async (latitude: number, longitude: number) => {
  const response = await AxiosInstance.get(`/weather`, {
    params: { latitude, longitude },
  });
  return response.data;
};

// Map control component
const MapControl = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  return null;
};

// Weather chart component
const WeatherChart = ({ weatherData, placeName }: { weatherData: any; placeName: string }) => (
  <Paper style={{ padding: 16, marginTop: 16 }}>
    <Typography variant="h5">Weather Data for {placeName}</Typography>
    <Chart
      type="line"
      data={{
        labels: ['Now'],
        datasets: [
          {
            label: "Temperature",
            data: [weatherData.main.temp - 273.15], // Convert Kelvin to Celsius
            borderColor: "rgba(255, 99, 132, 0.2)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
          {
            label: "Pressure",
            data: [weatherData.main.pressure],
            borderColor: "rgba(54, 162, 235, 0.2)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
        ],
      }}
    />
  </Paper>
);

const PlacesPage = () => {
  const { data: places = [], error: placesError } = useQuery('places', fetchPlaces);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [filter, setFilter] = useState("all");

  // Fetch weather data if a place is selected
  const { data: weatherData, error: weatherError } = useQuery(
    ['weather', selectedPlace?.latitude, selectedPlace?.longitude],
    () => fetchWeather(selectedPlace!.latitude, selectedPlace!.longitude),
    { enabled: !!selectedPlace }
  );

  const filteredPlaces = useMemo(() => 
    filter === "all" ? places : places.filter((place: Place) => place.type === filter),
    [filter, places]
  );

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  if (placesError) return <div>Error fetching places</div>;
  if (weatherError) return <div>Error fetching weather data</div>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Places</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by type</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="restaurant">Restaurant</MenuItem>
          <MenuItem value="hotel">Hotel</MenuItem>
          <MenuItem value="park">Park</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper style={{ height: "500px", width: "100%" }}>
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapControl position={selectedPlace ? [selectedPlace.latitude, selectedPlace.longitude] : null} />
              {filteredPlaces.map((place: Place) => (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                  eventHandlers={{
                    click: () => handlePlaceClick(place),
                  }}
                >
                  <Popup>
                    {place.name}
                    <br />
                    {place.address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          {selectedPlace && weatherData && (
            <WeatherChart weatherData={weatherData} placeName={selectedPlace.name} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlacesPage;
