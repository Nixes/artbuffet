import React from 'react';
import ReactDOM from 'react-dom';
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Grid,
    AutoSizer,
    WindowScroller,
    Positioner,
    GridCellProps
} from 'react-virtualized';
import GalleryItem from "../models/GalleryItem";
import ArtStationAPI, {SORT} from "../api/ArtStationAPI";
import {GalleryAPIInterface} from "../api/GalleryAPIInterface";


type GalleryState = {
    items: Map<number,GalleryItem>,
    lastId: number,
    pageNumber: number,
    columnCount: number
}

export class GalleryGrid extends React.Component<{galleryAPI: GalleryAPIInterface,sortOrder: string},GalleryState> {
    // locks downloading to one page only, so we don't download duplicated pages
    private isDownloading: boolean;

    private IMAGE_WIDTH;
    private IMAGE_HEIGHT;
    private COLUMN_WIDTH;
    private GUTTER = 0;


    constructor(props) {
        super(props);
        this.isDownloading = false;

        this.state = {
            items: new Map<number,GalleryItem>(),
            lastId:0,
            pageNumber: 1,
            columnCount: 4
        };

        this.IMAGE_HEIGHT = GalleryGrid.calculatePixelValue(200);
        this.IMAGE_WIDTH = GalleryGrid.calculatePixelValue(200);
        this.COLUMN_WIDTH = GalleryGrid.calculatePixelValue(200);
    }

    private resetChildState = () => {
        this.setState({
            items: new Map<number,GalleryItem>(),
            lastId:0,
            pageNumber: 1,
            columnCount: 4
        });

        this.isDownloading = false;
        // need to forceload at least one page
        this.getNewPage();
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.sortOrder!== prevProps.sortOrder) {
            // if sort order changed, then we need to rerender the entire gallery
            this.resetChildState();
        }
    }

    private static calculatePixelValue = (realPixels: number): number => {
        let pixelRatio = window.devicePixelRatio || 1;
        // add some custom scaling for highdpi devices
        if (pixelRatio > 1) {
            pixelRatio = pixelRatio*0.6;
        }
        return Math.floor(realPixels/pixelRatio);
    }

    calculateRowCount = (): number => {
        const rowCount = Math.floor(this.state.items.size / this.state.columnCount);
        console.log("Row count calcuated as: "+rowCount);
        console.log("Number of items: "+this.state.items.size+"columnCount: "+this.state.columnCount);
        return rowCount
    }

    stateAddPageItems = async (items: GalleryItem[]) => {
        let previousState = Object.assign({}, this.state);
        items.forEach((item) => {
            previousState.items.set(previousState.lastId,item);
            // @ts-ignore
            previousState.lastId++;
        });
        // @ts-ignore ignored due to broken react types
        previousState.pageNumber++;
        await this.setState(previousState);
    }

    getNewPage = async () => {
        this.isDownloading = true;
        // get initial page of results to get us started
        const items = await this.props.galleryAPI.getGalleryItems(this.state.pageNumber,this.props.sortOrder);
        await this.stateAddPageItems(items);
        this.isDownloading = false;
    }

    private setColumnCount(columnCount:number) {
        let prevState = Object.assign([],this.state);
        // @ts-ignore
        prevState.columnCount = columnCount;
        this.setState(prevState);
    }

    onResize = ({width}: any) => {
        this.setColumnCount(this.calculateColumnCount(width));
        // this.resetCellPositioner();
    }

    cellRenderer = (cellProps: GridCellProps) => {
        const correctIndex = (cellProps.rowIndex * this.state.columnCount) +cellProps.columnIndex;
        console.log("key: "+cellProps.key+" index: "+correctIndex);
        const items = this.state.items;
        // this is from the masonry example
        const item = items.get(correctIndex);
        if (typeof item !== "object") {
            console.log("Items: ");
            console.log(items);
            throw new Error("Missing item")
        };
        return (
            <a key={cellProps.key} style={cellProps.style} href={item.itemURL}>
                <img width={this.IMAGE_WIDTH} height={this.IMAGE_HEIGHT} src={item.thumbnailImageURL}/>
            </a>
        );
    }

    /**
     * returns number of columns, must be 1 or greater
     * @param width
     */
    calculateColumnCount = (width: number): number =>  {
        const calculatedColumnCount =  Math.floor((width + this.GUTTER) / (this.COLUMN_WIDTH + this.GUTTER));
        if (calculatedColumnCount > 0) {
            return calculatedColumnCount
        } else {
            return 1;
        }
    }

    generateItem = async (): Promise<GalleryItem> => {
        let prevState = Object.assign({}, this.state);
        console.log("Previous last id: ");
        console.log(prevState.lastId);
        // @ts-ignore since this is not actually read only but the react types are fucked
        prevState.lastId = prevState.lastId + 1;
        await this.setState(prevState);

        console.log("Newlast id: ");
        console.log(prevState.lastId);
        return {id: prevState.lastId, thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}
    }

    stateAddItem = async (item: GalleryItem) => {
        let previousState = Object.assign({}, this.state);
        previousState.items.set(item.id,item);
        await this.setState(previousState);
    }

    private isPageFilled(windowHeight: number,windowWidth: number): boolean {
       const numImages = this.state.items.size;
       const minNumberOfRows = Math.ceil(windowHeight / this.IMAGE_HEIGHT);
       const minNumberOfImagesFill = this.state.columnCount * minNumberOfRows;
       return numImages > minNumberOfImagesFill;
    }

    onScroll = async (params: {clientHeight: number, clientWidth: number ,scrollHeight: number, scrollTop: number}) => {
        // don't run if we are still waiting on a download
        if (this.isDownloading) return;
        // console.log("onScroll ran");
        // console.log("clientHeight: "+params.clientHeight+" scrollHeight: "+params.scrollHeight
        //     +" scrollTop: "+params.scrollTop);
        const preloadPages = 1;
        const loadAheadOffset = params.clientHeight* preloadPages;

        if ((params.scrollTop + params.clientHeight) >= (params.scrollHeight - loadAheadOffset)) {
            console.log("Getting new page");
            await this.getNewPage();
            // check to see if we need to make more page requests to fill the first page
            while(!this.isPageFilled(params.clientHeight,params.clientWidth)) {
                await this.getNewPage();
            }
        }
    }

    public render = () => {
        // Render your grid
        return (
            <WindowScroller scrollElement={window}>
                {({height, isScrolling, onChildScroll, scrollTop}) => (
                    <div>
                        <AutoSizer id={"autosizer"} onResize={this.onResize} disableHeight>
                            {({width}) => (
                                    <Grid
                                        columnCount={this.state.columnCount}
                                        cellRenderer={this.cellRenderer}
                                        height={height}
                                        width={width}
                                        rowHeight={this.IMAGE_HEIGHT}
                                        rowCount={this.calculateRowCount()}
                                        columnWidth={this.IMAGE_WIDTH}
                                        onScroll={this.onScroll}
                                        autoHeight
                                        scrollTop={scrollTop}
                                    />
                            )}
                        </AutoSizer>
                    </div>
                )}
            </WindowScroller>
        );
    }
}