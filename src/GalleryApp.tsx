import React from 'react';
import './App.css';
import {GalleryGrid} from "./components/GalleryGrid";
import {OptionsMenu} from "./components/OptionsMenu";
import {ErrorHandler} from "./components/errorhandler/ErrorHandler";
import ArtStationAPI, {SORT} from "./api/ArtStationAPI";
import {GalleryAPIInterface} from "./api/GalleryAPIInterface";
import { Route, BrowserRouter as Router, Link, match } from 'react-router-dom';



class GalleryApp extends React.PureComponent<any, {sortOrder:string}> {
    private galleryAPI: GalleryAPIInterface;


    constructor(props) {
        super(props);

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            this.galleryAPI = new ArtStationAPI('http://localhost:3000');
        } else {
            this.galleryAPI = new ArtStationAPI();
        }

        this.state = {
            sortOrder:SORT.TRENDING
        };
    }

    private changeSortOrder = (newSortOrder: string) => {
        this.setState({sortOrder: newSortOrder});
    }

    render() {
        return <div className="App">
            <OptionsMenu changeSortOrder={this.changeSortOrder} defaultSortOrder={this.state.sortOrder} sortingOptions={this.galleryAPI.AVAILABLE_SORT_ORDERS}></OptionsMenu>
            <ErrorHandler></ErrorHandler>
            <GalleryGrid galleryAPI={this.galleryAPI} sortOrder={this.state.sortOrder} pageNumber={1}></GalleryGrid>
            <Router>
                <div>
                    <Route exact path="/" component={ (props) =>  <GalleryGrid galleryAPI={this.galleryAPI} sortOrder={this.state.sortOrder} pageNumber={1}/>} />
                    <Route exact path="/page/:pageNumber" component={(props) => <GalleryGrid galleryAPI={this.galleryAPI} sortOrder={this.state.sortOrder} pageNumber={parseInt(props.match.params.pageNumber)}></GalleryGrid>} />
                </div>
            </Router>
        </div>
    }
}

export default GalleryApp;
