import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Gallery} from "./components/Gallery";
import {GalleryGrid} from "./components/GalleryGrid";
import {OptionsMenu} from "./components/OptionsMenu";
import {ErrorHandler} from "./components/errorhandler/ErrorHandler";
import {SORT} from "./api/ArtStationAPI";



class GalleryApp extends React.PureComponent<any, {sortOrder:SORT}> {
    constructor(props) {
        super(props);

        this.state = {
            sortOrder:SORT.TRENDING
        };
    }

    private changeSortOrder = (newSortOrder: SORT) => {
        console.log("Change sort order called: ");
        console.log(newSortOrder);
        this.setState({sortOrder: newSortOrder});
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return <div className="App">
            <OptionsMenu changeSortOrder={this.changeSortOrder}></OptionsMenu>
            <ErrorHandler></ErrorHandler>
            <GalleryGrid sortOrder={this.state.sortOrder}></GalleryGrid>
        </div>
    }
}

export default GalleryApp;
