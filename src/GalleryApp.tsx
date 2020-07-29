import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Gallery} from "./components/Gallery";
import {GalleryGrid} from "./components/GalleryGrid";
import {ErrorBoundryWrapper} from "./components/ErrorBoundryWrapper";



const GalleryApp: React.FC = () => {
  return (
    <div className="App">
        <ErrorBoundryWrapper>
            <GalleryGrid></GalleryGrid>
        </ErrorBoundryWrapper>
    </div>
  );
}

export default GalleryApp;
