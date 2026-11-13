import React, { useEffect, useState } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('settings') || '{}');
      return typeof saved.darkMode === 'boolean' ? saved.darkMode : false;
    } catch {
      return false;
    }
  });
  const [emailNotifications, setEmailNotifications] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('settings') || '{}');
      return typeof saved.emailNotifications === 'boolean' ? saved.emailNotifications : true;
    } catch {
      return true;
    }
  });

  // Apply theme and persist on change
  useEffect(() => {
    const settings = { darkMode, emailNotifications };
    localStorage.setItem('settings', JSON.stringify(settings));
    document.body.classList.toggle('theme-dark', darkMode);
  }, [darkMode, emailNotifications]);

  return (
    <div className="settings-panel">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-grid">
        <section className="settings-section">
          <h3>Appearance</h3>
          <label>
            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            Enable dark theme
          </label>
          <p>Applies the dark palette throughout the dashboard.</p>
        </section>

        <section className="settings-section">
          <h3>Notifications</h3>
          <label>
            <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
            Email notification preference (demo only)
          </label>
          <p>This preference is stored in this browser. The app does not send email notifications.</p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
