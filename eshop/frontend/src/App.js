import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductDetails from './components/product/ProductDetails'

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route exact path="/" component={HomePage} />
          <Route path="/search/:keyword" component={HomePage} />
          <Route path="/product/:id" component={ProductDetails} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;