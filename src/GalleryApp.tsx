import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Gallery} from "./components/Gallery";
import {GalleryGrid} from "./components/GalleryGrid";



const GalleryApp: React.FC = () => {
  return (
    <div className="App">
        <div id="options-bar"><p>This is where selection options will appear</p></div>
      <GalleryGrid></GalleryGrid>
    </div>
  );
}

export default GalleryApp;
