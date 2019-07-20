import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Gallery} from "./components/Gallery";
import {GalleryGrid} from "./components/GalleryGrid";
import {OptionsMenu} from "./components/OptionsMenu";



const GalleryApp: React.FC = () => {
  return (
    <div className="App">
        <OptionsMenu></OptionsMenu>
      <GalleryGrid></GalleryGrid>
    </div>
  );
}

export default GalleryApp;
