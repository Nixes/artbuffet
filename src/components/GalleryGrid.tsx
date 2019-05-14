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
import ArtStationAPI from "../api/ArtStationAPI";

const GUTTER = 1;
const COLUMN_WIDTH = 200;
const IMAGE_HEIGHT = 200;
const IMAGE_WIDTH = 200;

// Array of images with captions
// const list: DatumImage[] = [
//     {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
//     {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
//     {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
//     {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
//     {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
//     {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
//     {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
//     {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
// ];

type GalleryState = {
    items: Map<number,GalleryItem>,
    lastId: number,
    pageNumber: number,
}

export class GalleryGrid extends React.Component<any,GalleryState> {
    private height: number;
    private width: number;
    private columnCount: number;
    private cellPositioner: Positioner;
    private cache: CellMeasurerCache;

    constructor(props) {
        super(props);


        this.state = {
            items: new Map<number,GalleryItem>(),
            lastId:0,
            pageNumber: 1,
        };

        this.height = 600;
        this.width = 800;
        this.columnCount = 4;

        // Default sizes help Masonry decide how many images to batch-measure
        this.cache = new CellMeasurerCache({
            defaultHeight: 200,
            defaultWidth: 200,
            fixedWidth: true,
        });

        // Our masonry layout will use 3 columns with a 10px gutter between
        this.cellPositioner = createMasonryCellPositioner({
            cellMeasurerCache: this.cache,
            columnCount: this.columnCount,
            columnWidth: 200,
            spacer: 10
        });

        this.calculateRowCount();
    }

    calculateRowCount = (): number => {
        const rowCount = Math.floor(this.state.items.size / this.columnCount);
        console.log("Row count calcuated as: "+rowCount);
        console.log("Number of items: "+this.state.items.size+"columnCount: "+this.columnCount);
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
        // get initial page of results to get us started
        const items = await ArtStationAPI.getGalleryItems(this.state.pageNumber);
        await this.stateAddPageItems(items);
    }


    onResize = ({width}: any) => {
        this.cache.clearAll();
        this.columnCount = this.calculateColumnCount(width);
        // this.resetCellPositioner();
    }

    cellRenderer = (cellProps: GridCellProps) => {
        const correctIndex = (cellProps.rowIndex * this.columnCount) +cellProps.columnIndex;
        console.log("key: "+cellProps.key+" index: "+correctIndex);
        const items = this.state.items;
        // this is from the masonry example
        const item = items.get(correctIndex);
        if (typeof item !== "object") {
            console.log("Items: ");
            console.log(items);
            throw new Error("Missing item")
        };
        /* <div style={cellProps.style}> */
        return (
            <img key={cellProps.key} style={{ margin: 0,padding:0}} width={IMAGE_WIDTH} height={IMAGE_HEIGHT} src={item.thumbnailImageURL}/>
        );
    }

    /**
     * returns number of columns, must be 1 or greater
     * @param width
     */
    calculateColumnCount = (width: number): number =>  {
        const calculatedColumnCount =  Math.floor((width + GUTTER) / (COLUMN_WIDTH + GUTTER));
        if (calculatedColumnCount > 0) {
            return calculatedColumnCount
        } else {
            return 1;
        }
    }

    resetCellPositioner = () => {
        this.cellPositioner.reset({
            columnCount: this.columnCount,
            columnWidth: COLUMN_WIDTH,
            spacer: GUTTER,
        });
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

    onScroll = async (params: {clientHeight: number,scrollHeight: number, scrollTop: number}) => {
        // console.log("onScroll ran");
        // console.log("clientHeight: "+params.clientHeight+" scrollHeight: "+params.scrollHeight
        //     +" scrollTop: "+params.scrollTop);

        if ((params.scrollTop + params.clientHeight) >= params.scrollHeight) {
            console.log("Getting new page");
            await this.getNewPage();
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
                                        columnCount={this.columnCount}
                                        cellRenderer={this.cellRenderer}
                                        height={height}
                                        width={width}
                                        rowHeight={IMAGE_HEIGHT}
                                        rowCount={this.calculateRowCount()}
                                        columnWidth={IMAGE_WIDTH}
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