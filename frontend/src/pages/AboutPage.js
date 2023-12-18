import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutComponent from "../components/about/DespreNoi";
import ContactComponent from "../components/about/Contact";

const AboutPage = () => {
  return (
    <div>
      <Header />
      <AboutComponent />
        <ContactComponent/>
        <Footer/>
    </div>
  );
}

export default AboutPage;
