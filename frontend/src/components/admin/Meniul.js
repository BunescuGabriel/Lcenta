import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import BannerManager from './BannerManager';
import '../../styles/admin/SettingsA.css';
import CommentsManager from "./CommentsManager";
import CarsManager from "./CarsManager";
import RatingsManager from "./RatingManager";
import UsersManager from "./UsersManager";

const Meniul = () => {
  const [showBannerManager, setShowBannerManager] = useState(false);
  const [showCarsManager, setShowCarsManager] = useState(false);
  const [showCommentsManager, setshowCommentsManager] = useState(false);
  const [showRatingsManager, setshowRatingsManager] = useState(false);
  const [showUsersManager, setshowUsersManager] = useState(false);

  const toggleBannerManager = () => {
    setShowBannerManager(!showBannerManager);
  };
  const toggleCarsManager = () => {
    setShowCarsManager(!showCarsManager);
  };
  const toggleCommentsManager = () => {
    setshowCommentsManager(!showCommentsManager);
  };
  const toggleRatingsManager = () => {
    setshowRatingsManager(!showRatingsManager);
  };
  const toggleUsersManager = () => {
    setshowUsersManager(!showUsersManager);
  };


  return (
    <div className="admin-row">
      <div className="admin-container">
        <div className="settings-admin">
          <h1>
            Settings
            <FontAwesomeIcon icon={faCog} className="settings-icon" />
          </h1>
          <div className="control-buttons-container">
            <button className="control-button" onClick={toggleBannerManager}>
              Banners
            </button>
            <button className="control-button" onClick={toggleCarsManager}>
              Cars
            </button>
            <button className="control-button" onClick={toggleCommentsManager}>
              Comments
            </button>
            <button className="control-button" onClick={toggleRatingsManager}>
              Ratings
            </button>
            <button className="control-button" onClick={toggleUsersManager}>
              Users
            </button>
          </div>
        </div>
      </div>
      <div>
        {showBannerManager && <BannerManager />}
        {showCarsManager && <CarsManager />}
        {showCommentsManager && <CommentsManager />}
        {showRatingsManager && <RatingsManager />}
        {showUsersManager && <UsersManager />}
      </div>

    </div>
  );
};

export default Meniul;