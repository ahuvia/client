import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import PlacesPage from "./PlacesPage";
import CreationPage from "./CreationPage";

function App() {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              My Places
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/places">
              Places
            </Button>
            <Button color="inherit" component={Link} to="/create">
              Create Place
            </Button>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/create" element={<CreationPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

const Home = () => {
  return <Typography variant="h4">Welcome to the Home Page!</Typography>;
};

export default App;
