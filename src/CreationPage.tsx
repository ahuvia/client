import React, { useState } from "react";
import { TextField, Button, Container, Typography, MenuItem, Box } from "@mui/material";
import AxiosInstance from "./axiosInstance";

interface PlaceField {
  name: string;
  label: string;
  type: string;
  options?: string[];
  maxLength?: number;
}

interface PlaceData {
  [key: string]: string;
}

const placeFields: PlaceField[] = [
  { name: "name", label: "Name", type: "text", maxLength: 25 },
  { name: "type", label: "Type", type: "select", options: ["Restaurant", "Hotel", "Park"] },
  { name: "address", label: "Address", type: "text" },
];

const initialState: PlaceData = placeFields.reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {} as PlaceData);

const CreationPage: React.FC = () => {
  const [placeData, setPlaceData] = useState<PlaceData>(initialState);
  const [errors, setErrors] = useState<PlaceData>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = placeFields.find(f => f.name === name);
    
    if (field?.maxLength && value.length > field.maxLength) {
      return; // Prevent input if max length is exceeded
    }
    
    setPlaceData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: PlaceData = {};
    let isValid = true;

    placeFields.forEach(field => {
      if (!placeData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      } else if (field.maxLength && placeData[field.name].length > field.maxLength) {
        newErrors[field.name] = `${field.label} must not exceed ${field.maxLength} characters`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await AxiosInstance.post("/place", placeData);
      alert("Place added successfully!");
      setPlaceData(initialState);
    } catch (error) {
      alert("Failed to add place");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create a New Place</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {placeFields.map((field) => (
          <TextField
            key={field.name}
            fullWidth
            select={field.type === "select"}
            name={field.name}
            label={field.label}
            value={placeData[field.name]}
            onChange={handleChange}
            error={!!errors[field.name]}
            helperText={errors[field.name] || (field.maxLength ? `Max ${field.maxLength} characters` : '')}
            margin="normal"
            inputProps={{
              maxLength: field.maxLength
            }}
          >
            {field.type === "select" && field.options?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ))}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default CreationPage;