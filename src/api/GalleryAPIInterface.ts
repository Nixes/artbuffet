import GalleryItem from "../models/GalleryItem";

export interface GalleryAPIInterface {
    readonly AVAILABLE_SORT_ORDERS: string[];

    isValidSortOrder(sortOrder:string): boolean;
    getGalleryItems(page: number,sorting: string): Promise<GalleryItem[]>;
}