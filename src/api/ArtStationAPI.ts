import GalleryItem from "../models/GalleryItem";

export enum SORT {
    TRENDING = 'trending',
    LATEST = 'latest',
    PICKS = 'picks',
    POPULARITY = 'popularity'
}

export const SORTING_AVAILABLE = [
    SORT.TRENDING,
    SORT.LATEST,
    SORT.PICKS,
    SORT.POPULARITY,
];

export default class ArtStationAPI {
    /**
     *
     * @param page
     * @param sorting optional
     */
    public static async getGalleryItems(page: number,sorting: SORT = SORT.TRENDING): Promise<GalleryItem[]> {
        const options = {
            mode: "cors"
        };
        const url = `https://cors-anywhere.herokuapp.com/https://www.artstation.com/projects.json?page=${page}&sorting=${sorting}`;
        // @ts-ignore this typecheck is incorrect
        const response = await fetch(url,options);
        const json = await response.json();
        const artstationItems: [] = json.data;
        const convertedItems: GalleryItem[] = artstationItems.map((artstationItem:any)=>{
            return {id:artstationItem.id,itemURL:artstationItem.permalink,thumbnailImageURL:artstationItem.cover.micro_square_image_url};
        });
        return convertedItems;
    }
}
