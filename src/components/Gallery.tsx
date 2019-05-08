import React from 'react';
import ReactDOM from 'react-dom';
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    AutoSizer,
    WindowScroller,
    Positioner,
    MasonryCellProps
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

export class Gallery extends React.Component<any,GalleryState> {
    private height: number;
    private width: number;
    private columnCount: number;
    private cellPositioner: Positioner;
    private cache: CellMeasurerCache;
    private masonry;

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
            defaultHeight: 250,
            defaultWidth: 200,
            fixedWidth: true,
        });

        // Our masonry layout will use 3 columns with a 10px gutter between
        this.cellPositioner = createMasonryCellPositioner({
            cellMeasurerCache: this.cache,
            columnCount: 3,
            columnWidth: 200,
            spacer: 10
        });


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
        this.calculateColumnCount(width);
        this.resetCellPositioner();
        this.masonry.recomputeCellPositions();
    }

    cellRenderer = (cellProps: MasonryCellProps) => {
        const items = this.state.items;
        console.log("Items: ");
        console.log(items);
        // this is from the masonry example
        const item = items.get(cellProps.index % items.size);
        if (typeof item !== "object") {
            throw new Error("Missing item")
        };

        return (
            <CellMeasurer
                cache={this.cache}
                index={cellProps.index}
                key={cellProps.key}
                parent={cellProps.parent}
            >
                <div style={cellProps.style}>
                    <img width={IMAGE_WIDTH} height={IMAGE_HEIGHT} src={item.thumbnailImageURL}/>
                </div>
            </CellMeasurer>
        );
    }

    calculateColumnCount = (width: number) =>  {
        this.columnCount = Math.floor((width + GUTTER) / (COLUMN_WIDTH + GUTTER));
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

    // getNewPage = async () => {
    //     const sillyFunction = async (): Promise<any> => {
    //         const item = await this.generateItem();
    //         console.log("new item: "); console.log(item);
    //         await this.stateAddItem(item);
    //     }
    //     let promises: Promise<any>[] = [];
    //     for(let i=0;i<5;i++){
    //         await sillyFunction();
    //     }
    // }

    onScroll = async (params: {clientHeight: number,scrollHeight: number, scrollTop: number}) => {
        console.log("onScroll ran");
        console.log("clientHeight: "+params.clientHeight+" scrollHeight: "+params.scrollHeight
            +" scrollTop: "+params.scrollTop);

        if ((params.scrollTop + params.clientHeight) >= params.scrollHeight) {
            await this.getNewPage();
        }
    }

    public render = () => {
        // Render your grid
        return (
            <WindowScroller scrollElement={window}>
                {({height, isScrolling, onChildScroll, scrollTop}) => (
                    <div>
                        <AutoSizer disableHeight onResize={this.onResize}>
                            {({width}) => (

                                    <Masonry
                                        cellCount={this.state.items.size}
                                        cellMeasurerCache={this.cache}
                                        cellPositioner={this.cellPositioner}
                                        cellRenderer={this.cellRenderer}
                                        height={height}
                                        width={width}
                                        onScroll={this.onScroll}
                                        autoHeight
                                        ref={(r: Masonry) => this.masonry = r}
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