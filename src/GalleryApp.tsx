import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Gallery} from "./components/Gallery";



const GalleryApp: React.FC = () => {
  return (
    <div className="App">
      <Gallery></Gallery>
    </div>
  );
}

export default GalleryApp;
