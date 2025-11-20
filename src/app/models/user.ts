
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
    features: string | string[];
    videoLink: string;
    categoryId: string;
    categoryName: string | null;
}

export interface userDetails {
    id: string;
    name: string;
    phoneNumber: string | null;
    email: string;
    createdAt: string;
    applicationUserTypeId: number;
    avatarUrl: string | null;
}