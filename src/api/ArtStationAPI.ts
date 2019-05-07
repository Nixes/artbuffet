import GalleryItem from "../models/GalleryItem";

export default class ArtStationAPI {
    constructor() {

    }

    public static async getGalleryItems(page: number): Promise<GalleryItem[]> {
        const options = {};
        const url = `https://www.artstation.com/projects.json?page=${page}&sorting=trending`;
        const response = await fetch(url,options);
        const json = await response.json();
        const artstationItems: [] = json.data;
        const convertedItems: GalleryItem[] = artstationItems.map((artstationItem:any)=>{
            return {itemURL:artstationItem.permalink,thumbnailImageURL:artstationItem.cover.micro_square_image_url};
        });
        return convertedItems;
    }
}
