import React from 'react';
import ReactDOM from 'react-dom';
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    AutoSizer
} from 'react-virtualized';

type DatumImage = {
    source: string,
    caption: string,
    imageHeight: number,
    imageWidth: number,
}

// Array of images with captions
const list: DatumImage[] = [
    {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
    {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
    {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
    {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
    {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
    {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
    {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
    {source: "https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002", caption: "nothing", imageHeight:200,imageWidth:200},
];

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
    defaultHeight: 250,
    defaultWidth: 200,
    fixedWidth: true,
})

// Our masonry layout will use 3 columns with a 10px gutter between
const cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: cache,
    columnCount: 3,
    columnWidth: 200,
    spacer: 10
});


export class Gallery extends React.Component<any> {
    private _height: number;
    private _width: number;
    private _columnCount: number;

    constructor(props) {
        super(props);

        this._height = 600;
        this._width = 800;
        this._columnCount = 4;
    }

    private cellRenderer ({ index, key, parent, style }) {
        const datum:DatumImage = list[index]

        return (
            <CellMeasurer
                cache={cache}
                index={index}
                key={key}
                parent={parent}
            >
                <div style={style}>
                    <img
                        src={datum.source}
                        style={{
                            height: datum.imageHeight,
                            width: datum.imageWidth
                        }}
                    />
                </div>
            </CellMeasurer>
        )
    }

    _calculateColumnCount() {
        const {columnWidth, gutterSize} = this.state;

        this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
    }


    private _onResize({width}) {
        this._width = width;

        this._calculateColumnCount();
        this._resetCellPositioner();
        this._masonry.recomputeCellPositions();
    }

    private _setMasonryRef(ref) {
        this._masonry = ref;
    }

    _renderAutoSizer({height, scrollTop}) {
        this._height = height;
        this._scrollTop = scrollTop;

        const {overscanByPixels} = this.state;

        return (
            <AutoSizer
                disableHeight
                height={height}
                onResize={this._onResize}
                overscanByPixels={overscanByPixels}
                scrollTop={this._scrollTop}>
                {this._renderMasonry}
            </AutoSizer>
        );
    }

    public _renderMasonry({width}) {
        // Render your grid
        return (
            <Masonry
                autoHeight={true}
                cellCount={list.length}
                cellMeasurerCache={cache}
                cellPositioner={cellPositioner}
                // @ts-ignore
                cellRenderer={this.cellRenderer}
                width={width}
                height={this.height}
                ref={this._setMasonryRef}
            />
        );
    }
    public render() {
        // Render your grid
        return (
            <Masonry
                autoHeight={true}
                cellCount={list.length}
                cellMeasurerCache={cache}
                cellPositioner={cellPositioner}
                // @ts-ignore
                cellRenderer={this.cellRenderer}
                width={this.width}
                height={this.height}
                ref={this._setMasonryRef}
            />
        );
    }
}