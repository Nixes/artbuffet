import GalleryItem from "../models/GalleryItem";
import ArtStationAPI, {SORT, SORTING_AVAILABLE} from "../api/ArtStationAPI";
import {AutoSizer, Grid, GridCellProps, WindowScroller} from "react-virtualized";
import React from "react";

export class OptionsMenu extends React.PureComponent<{changeSortOrder: (newSortOrder:SORT) => void },{sortingOptions:SORT[],selectedSorting:number,value:SORT}> {

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
        this.props.changeSortOrder(event.target.value);
    }

    public render = () => {
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