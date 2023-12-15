import React from 'react';
import '../styles/Footer.css';
import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt} from "react-icons/fa";
import logo from "../images/logo.jpg"; // Fișierul de stilizare pentru footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <a  href="/"><img src={logo} alt="Home" className="logo-img-footer" /></a>
          <p>Adresa noastra, contacteaza-ne prin intermediul retelelor sociale, telefon, viber, facebook sau telegram.</p>
        </div>
        <div className="footer-right">
          <h4>Linkuri Utile</h4>
          <ul>
            <li><a href="/">Home</a></li>
          <li><a href="/despre">About</a></li>
          <li><a href="/conditii">TERMENI ȘI CONDIȚII</a></li>
          </ul>
        </div>
           <div className="footer-right">
          <h4>OFICIUL CENTRAL</h4>
          <ul>
        <p className="contact-info"><FaMapMarkerAlt /> Balti str. Kiev 48A</p>
        <p className="contact-info">
          <FaInstagram /> <a className={"contact-linkk"} href="https://www.instagram.com/supreme__rentals/" target="_blank" rel="noopener noreferrer">Supreme Rentals</a>
        </p>
        <p className="contact-info">
          <FaFacebook /> <a className={"contact-linkk"} href="https://www.facebook.com/ChirieAutoBALTI" target="_blank" rel="noopener noreferrer">Supreme Rentals</a>
        </p>
              <p className="contact-info"><FaEnvelope /> adresa@email.com</p>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Numele Companiei. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
};

export default Footer;
