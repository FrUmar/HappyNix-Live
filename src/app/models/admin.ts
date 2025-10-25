export interface AdminCategory {
    categoryId: string;
    name: string;
    description: string;
    imageUrl: string;
    totalItems: number;
}

export interface AdminTools {
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

// {
//     "name": "string",
//     "shortDescription": "string",
//     "longDescription": "string",
//     "mainImage": "string",
//     "isFree": true,
//     "isPaid": true,
//     "downloadLink": "string",
//     "price": 0,
//     "version": "string",
//     "releaseDate": "2025-10-25T06:53:26.604Z",
//     "features": "string",
//     "videoLink": "string",
//     "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
//   }
export interface AdminProductPayload {
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
    features: string[];
    videoLink: string;
    categoryId: string;
}

export interface AdminProduct extends AdminProductPayload {
    productId: string;
    categoryName: string | null;
}

export interface AdminUserWithRole {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    isNew: boolean;
    phoneNumber: string | null;
    role: string;
}