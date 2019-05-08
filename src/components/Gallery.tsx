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
    lastId: number
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
            items: new Map<number,GalleryItem>( [
                [0,{id:1,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002",
                    itemURL:"https://www.artstation.com"}],
                [1,{id:2,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002",
                    itemURL:"https://www.artstation.com"}],
                [2,{id:3,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002",
                    itemURL:"https://www.artstation.com"}],
                [3,{id:4,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}],
                [4,{id:4,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}],
                [5,{id:5,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}],
                [6,{id:6,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}],
                [7,{id:7,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}],
                [8,{id:8,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}],
                [9,{id:9,thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}],
            ]),
            lastId:5
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


    onResize = ({width}: any) => {
        this.cache.clearAll();
        this.calculateColumnCount(width);
        this.resetCellPositioner();
        this.masonry.recomputeCellPositions();
    }

    cellRenderer = (cellProps: MasonryCellProps) => {
        console.log("cellProps: "); console.log(cellProps);
        const items = this.state.items;
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
                    <img src={item.thumbnailImageURL}/>
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

    generateItem = (): GalleryItem => {
        let prevState = Object.assign({}, this.state);
        // @ts-ignore since this is not actually read only but the react types are fucked
        prevState.lastId = prevState.lastId + 1;
        this.setState(prevState);
        return {id: this.state.lastId, thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"}
    }



    onScroll = (params: {clientHeight: number,scrollHeight: number, scrollTop: number}) => {
        console.log("onScroll ran");
        console.log("clientHeight: "+params.clientHeight+" scrollHeight: "+params.scrollHeight
            +" scrollTop: "+params.scrollTop);

        this.generateItem();
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