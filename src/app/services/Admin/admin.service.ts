import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { RepositoryService } from '../repository/repository.service';
import { AdminCategory, AdminProduct, AdminProductPayload, AdminUserWithRole } from '../../models/admin';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    history: any[] = [];
    constructor(
        private router: Router,
        private repositoryService: RepositoryService
    ) { }
    // get Category
    getCategories(): Observable<AdminCategory[]> {
        return this.repositoryService.get('Admin/categories', true)
            .pipe(
                map((data: any) => data as AdminCategory[])
            );
    }
    // Auth/users-with-roles
    getUsersWithRoles(): Observable<any[]> {
        return this.repositoryService.get('Admin/users-with-roles', true)
            .pipe(
                map((data: any) => data)
            );
    }
    // category/get-category-list
    getCategoryList(): Observable<AdminCategory[]> {
        return this.repositoryService.get('category/get-category-list', true)
            .pipe(
                map((data: any) => data as AdminCategory[])
            );
    }
    // category/get-category-list
    getCategoryNameList(): Observable<AdminCategory[]> {
        return this.repositoryService.get('category/get-category-name-list', true)
            .pipe(
                map((data: any) => data as AdminCategory[])
            );
    }
    // category/update-category-info/4b3c1bc8-d5eb-4060-83bf-8597ad6c6d50
    updateCategoryInfo(categoryId: string, body: any): Observable<AdminCategory> {
        return this.repositoryService.putWithOutFile(`category/update-category-info/${categoryId}`, body)
            .pipe(
                map((data: any) => data as AdminCategory)
            );
    }
    // admin/get-products-list
    getProductsList(): Observable<AdminProduct[]> {
        return this.repositoryService.get('admin/get-products-list', true)
            .pipe(
                map((data: any) => data as AdminProduct[])
            );
    }
    // admin/add-Product
    addProduct(body: AdminProductPayload): Observable<AdminProduct> {
        return this.repositoryService.post('admin/add-Product', body, true)
            .pipe(
                map((data: any) => data as AdminProduct)
            );
    }
    // admin/get-product-details/c7db46a8-a18c-4655-afb4-cec9aa50b472
    getProductDetails(productId: string): Observable<AdminProduct> {
        return this.repositoryService.get(`admin/get-product-details/${productId}`, true)
            .pipe(
                map((data: any) => data as AdminProduct)
            );
    }
    // admin/update-Product-detail/3fa85f64-5717-4562-b3fc-2c963f66afa6
    updateProductDetail(productId: string, body: AdminProductPayload): Observable<AdminProduct> {
        return this.repositoryService.putWithOutFile(`admin/update-Product-detail/${productId}`, body)
            .pipe(
                map((data: any) => data as AdminProduct)
            );
    }
    // admin/delete-product
    deleteProduct(productId: string): Observable<any> {
        return this.repositoryService.delete(`admin/delete-product/${productId}`)
            .pipe(
                map((data: any) => data)
            );
    }
    // Auth/users-with-roles - get
    getUserRoles(): Observable<AdminUserWithRole[]> {
        return this.repositoryService.get('Auth/users-with-roles', true)
            .pipe(
                map((data: any) => data as AdminUserWithRole[])
            );
    }



}