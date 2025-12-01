import React from 'react';
import Settings from './components/Settings';
import './styles/theme.css';
import './App.css';

/**
 * Main App Component
 * Demonstrates integration of dark mode toggle feature
 */
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Application with Dark Mode</h1>
        <p>Toggle dark mode in the settings below</p>
      </header>
      
      <main className="App-main">
        <Settings />
        
        <section className="demo-content">
          <h2>Sample Content</h2>
          <p>
            This is a demonstration of the dark mode feature. 
            The entire application theme will change when you toggle dark mode.
          </p>
          
          <div className="card">
            <h3>Feature Highlights</h3>
            <ul>
              <li>Persistent theme preference</li>
              <li>Smooth transitions</li>
              <li>Accessible toggle switch</li>
              <li>System-wide theme support</li>
            </ul>
          </div>
          
          <button className="demo-button">
            Sample Button
          </button>
        </section>
      </main>
      
      <footer className="App-footer">
        <p>&copy; 2024 Dark Mode Implementation</p>
      </footer>
    </div>
  );
}

export default App;
