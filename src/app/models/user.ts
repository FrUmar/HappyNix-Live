
export interface toolDetails {
    productId: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    mainImage: string;
    isFree: boolean;
    isPaid: boolean;
    downloadLink: string;
    price: number;
    version: string;
    releaseDate: string;
    features: string;
    videoLink: string;
    categoryId: string;
    categoryName: string | null;
}