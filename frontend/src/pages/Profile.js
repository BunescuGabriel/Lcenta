import Header from "../components/Header";
import React from "react";
import Profil from "../components/Profil";
import Address from "../components/Address";

const Home = () => {
    return (
        <div>
             <Header />
          <h1>User Profile</h1>
      <Profil />
      <Address />
        </div>

    );
}

export default Home;