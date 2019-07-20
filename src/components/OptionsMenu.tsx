import GalleryItem from "../models/GalleryItem";
import ArtStationAPI, {SORTING_AVAILABLE} from "../api/ArtStationAPI";
import {AutoSizer, Grid, GridCellProps, WindowScroller} from "react-virtualized";
import React from "react";

export class OptionsMenu extends React.PureComponent {

    constructor(props) {
        super(props);


        this.state = {
            sortingOptions: SORTING_AVAILABLE,
            selectedSorting:0,
        };
    }

    public render = () => {
        // Render your grid
        return (
            <div id="options-bar"><p>This is where selection options will appear</p>
                <select>

                    <option value="trending">trending</option>
                    <option value="latest">latest</option>
                </select>
            </div>
        );
    }
}