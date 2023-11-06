import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import BannerManager from './BannerManager'; // Asigurați-vă că calea către fișierul BannerManager este corectă
import '../../styles/admin/SettingsA.css';

const Meniul = () => {
  const [showBannerManager, setShowBannerManager] = useState(false);

  const toggleBannerManager = () => {
    setShowBannerManager(!showBannerManager);
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
            <button className="control-button" onClick={toggleBannerManager}>
              gg
            </button>
          </div>
        </div>
      </div>
      <div>
        {showBannerManager && <BannerManager />}
      </div>

    </div>
  );
};

export default Meniul;