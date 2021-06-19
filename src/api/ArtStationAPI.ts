import GalleryItem from "../models/GalleryItem";
import {GalleryAPIInterface} from "./GalleryAPIInterface";

export enum SORT {
    TRENDING = 'trending',
    LATEST = 'latest',
    PICKS = 'picks',
    POPULARITY = 'popularity'
}

export default class ArtStationAPI implements GalleryAPIInterface {
    constructor(baseURL:string = '') {
        this.baseURL = baseURL;
    }
    public readonly AVAILABLE_SORT_ORDERS = [
        SORT.TRENDING,
        SORT.LATEST,
        SORT.PICKS,
        SORT.POPULARITY,
    ];
    private baseURL: string;

    public isValidSortOrder(sortOrder:string): boolean {
        const found = this.AVAILABLE_SORT_ORDERS.find(function (value) {
            return value === sortOrder;
        });
        return (found !== undefined);
    }

    /**
     *
     * @param page
     * @param sorting optional
     */
    public async getGalleryItems(page: number,sorting: string): Promise<GalleryItem[]> {
        if (!this.isValidSortOrder(sorting)) {
            throw new Error('Invalid sort order: '+sorting)
        }
        const options = {
            mode: "cors",
            // accept: "application/json"
            headers: {
                'Content-Type': 'application/json'
            },
        };
        const url = `${this.baseURL}/projects.json?page=${page}&sorting=${sorting}`;
        // @ts-ignore this typecheck is incorrect
        const response = await fetch(url,options);
        const json = await response.json();
        const artstationItems: [] = json.data;
        const convertedItems: GalleryItem[] = artstationItems.flatMap((artstationItem:any)=>{
            // check that there was cover art, some entries with no uploaded assets don't have any
            if (artstationItem.cover !== undefined && artstationItem.cover.micro_square_image_url !== undefined) {
                return [{
                    id:artstationItem.id,
                    itemURL:artstationItem.permalink,
                    thumbnailImageURL:artstationItem.cover.micro_square_image_url,
                    pageNumber: page
                }]
            }

            return [];
        });
        return convertedItems;
    }
}
