export default class GalleryItem {
    // link to artist page
    private itemURL: string;
    private thumbnailImageURL: string;

    constructor(itemURL: string, thumbnailImageURL: string) {
        this.itemURL = itemURL;
        this.thumbnailImageURL = thumbnailImageURL;
    }
}