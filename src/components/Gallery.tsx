import React from 'react';
import ReactDOM from 'react-dom';
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    AutoSizer,
    WindowScroller,
    Positioner
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
    items: GalleryItem[]
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
            items: [
                {thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"},
                {thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"},
                {thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"},
                {thumbnailImageURL: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", itemURL:"https://www.artstation.com"},
            ]
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

    cellRenderer = (cellProps: any) => {
        const items = this.state.items;
        const item = items[cellProps.index];

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

    public render = () => {
        // Render your grid
        return (
            <WindowScroller scrollElement={window}>
                {({height, isScrolling, onChildScroll, scrollTop}) => (
                    <div>
                        <AutoSizer disableHeight onResize={this.onResize}>
                            {({width}) => (
                                <Masonry
                                    cellCount={this.state.items.length}
                                    cellMeasurerCache={this.cache}
                                    cellPositioner={this.cellPositioner}
                                    cellRenderer={this.cellRenderer}
                                    height={height}
                                    width={width}
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