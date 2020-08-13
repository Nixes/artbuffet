import GalleryItem from "../models/GalleryItem";
import ArtStationAPI, {SORT, SORTING_AVAILABLE} from "../api/ArtStationAPI";
import {AutoSizer, Grid, GridCellProps, WindowScroller} from "react-virtualized";
import React from "react";

export class OptionsMenu extends React.PureComponent<any,{sortingOptions:SORT[],selectedSorting:number,value:string}> {

    constructor(props) {
        super(props);

        this.state = {
            value:SORT.TRENDING,
            sortingOptions: SORTING_AVAILABLE,
            selectedSorting:0,
        };
    }

    private handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    public render = () => {
        // Render your grid
        return (
            <div id="options-bar"><p>This is where selection options will appear. Current mode: {this.state.value}</p>
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="trending">trending</option>
                    <option value="latest">latest</option>
                </select>
            </div>
        );
    }
}