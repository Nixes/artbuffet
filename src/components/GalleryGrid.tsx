import React from 'react';
import {
    Grid,
    AutoSizer,
    WindowScroller,
    GridCellProps
} from 'react-virtualized';
import GalleryItem from "../models/GalleryItem";
import {GalleryAPIInterface} from "../api/GalleryAPIInterface";
import * as H from "history";
import {SectionRenderedParams} from "react-virtualized/dist/es/Grid";


type GalleryState = {
    items: Map<number,GalleryItem>,
    lastId: number,
    pageNumber: number,
    columnCount: number,
    visiblePageNumber: number
}

export class GalleryGrid extends React.PureComponent<{galleryAPI: GalleryAPIInterface,sortOrder: string, pageNumber: number,history: H.History},GalleryState> {
    // locks downloading to one page only, so we don't download duplicated pages
    private isDownloading: boolean;

    private static PRELOAD_PAGES = 4;

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
            pageNumber: this.props.pageNumber,
            visiblePageNumber: this.props.pageNumber,
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
        console.info("Row count calcuated as: "+rowCount);
        console.info("Number of items: "+this.state.items.size+"columnCount: "+this.state.columnCount);
        return rowCount
    }

    stateAddPageItems = async (items: GalleryItem[]) => {
        this.setState(prevState => {
            const newItems = new Map(prevState.items);
            let newLastId = prevState.lastId;
            items.forEach((item) => {
                newItems.set(newLastId, item);
                newLastId++;
            });
            return { items: newItems, lastId: newLastId };
        });
    }

    private setVisiblePageNumber = (visiblePageNumber: number) => {
        this.props.history.push(`/page/${visiblePageNumber}`);
        this.setState({ visiblePageNumber: visiblePageNumber });
    }

    getNewPage = async () => {
        this.isDownloading = true;
        // get initial page of results to get us started
        const items = await this.props.galleryAPI.getGalleryItems(this.state.pageNumber,this.props.sortOrder);
        await this.stateAddPageItems(items);
        this.setState({ pageNumber: this.state.pageNumber + 1 })
        this.isDownloading = false;
    }

    private setColumnCount(columnCount:number) {
        this.setState(prevState => ({
            ...prevState,
            columnCount: columnCount
        }));
    }

    onResize = ({width}: any) => {
        this.setColumnCount(this.calculateColumnCount(width));
    }

    private getItemForGridPos = (rowIndex:number, columnIndex:number): GalleryItem => {
        const correctIndex = (rowIndex * this.state.columnCount) +columnIndex;
        const item = this.state.items.get(correctIndex);
        if (typeof item !== "object" || item === null) {
            console.log("Items: ");
            console.log(this.state.items);
            throw new Error("Missing item")
        };
        return item;
    }

    cellRenderer = (cellProps: GridCellProps) => {
        const item = this.getItemForGridPos(cellProps.rowIndex,cellProps.columnIndex);

        return (
            <a key={cellProps.key} style={cellProps.style} href={item.itemURL}>
                <img width={this.IMAGE_WIDTH} height={this.IMAGE_HEIGHT} src={item.thumbnailImageURL} alt=""/>
            </a>
        );
    }

    /**
     * returns number of columns, must be 1 or greater
     * @param width
     */
    calculateColumnCount = (width: number): number => Math.max(Math.floor((width + this.GUTTER) / (this.COLUMN_WIDTH + this.GUTTER)), 1);

    stateAddItem = async (item: GalleryItem) => {
        let previousState = Object.assign({}, this.state);
        previousState.items.set(item.id,item);
        this.setState(previousState);
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
        const loadAheadOffset = params.clientHeight * GalleryGrid.PRELOAD_PAGES;

        if ((params.scrollTop + params.clientHeight) >= (params.scrollHeight - loadAheadOffset)) {
            await this.getNewPage();
            // check to see if we need to make more page requests to fill the first page
            while(!this.isPageFilled(params.clientHeight,params.clientWidth)) {
                await this.getNewPage();
            }
        }
    }

    /**
     * updates when visible region of windowed content being rendered changes
     * @param renderedParams
     */
    onSectionRendered = async (renderedParams:SectionRenderedParams) => {
        let topLeftItem = this.getItemForGridPos(renderedParams.rowStartIndex,renderedParams.columnStartIndex);
        this.setVisiblePageNumber(topLeftItem.pageNumber);
    }

    public render = () => {
        // Render your grid
        return (
            <WindowScroller scrollElement={window}>
                {({height, isScrolling, onChildScroll, scrollTop}) => (
                    <div>
                        <AutoSizer id={"autosizer"} onResize={this.onResize}>
                            {({width}) => (
                                    <Grid
                                        onSectionRendered={this.onSectionRendered}
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