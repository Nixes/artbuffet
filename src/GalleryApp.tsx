import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Gallery} from "./components/Gallery";
import {GalleryGrid} from "./components/GalleryGrid";
import {ErrorHandler} from "./components/errorhandler/ErrorHandler";



const GalleryApp: React.FC = () => {
  return (
    <div className="App">
        <ErrorHandler></ErrorHandler>
        <GalleryGrid></GalleryGrid>
    </div>
  );
}

export default GalleryApp;
