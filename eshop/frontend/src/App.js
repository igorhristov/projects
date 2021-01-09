import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route exact path="/" component={HomePage} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
