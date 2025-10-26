import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { RepositoryService } from '../repository/repository.service';
import { AdminCategory } from '../../models/admin';
import { Observable } from 'rxjs';
import { toolDetails } from '../../models/user';
export class AuthenticateModel {
    email!: string;
    password!: string;
}
@Injectable({
    providedIn: 'root',
})
export class UserService {
    history: any[] = [];
    constructor(
        private router: Router,
        private repositoryService: RepositoryService
    ) { }
    // User/me
    getUserProfile() {
        return this.repositoryService.get('User/me', true)
            .pipe(
                map((data: any) => {
                    return data;
                })
            );
    }
    getCategoryNameList(): Observable<AdminCategory[]> {
        return this.repositoryService.get('category/get-category-name-list', true)
            .pipe(
                map((data: any) => data as AdminCategory[])
            );
    }
    // products/get-free-products-list
    getFreeProductsList(): Observable<toolDetails[]> {
        return this.repositoryService.get('products/get-free-products-list', true)
            .pipe(
                map((data: any) => data as toolDetails[])
            );
    }
    // products/get-paid-products-list
    getPaidProductsList(): Observable<toolDetails[]> {
        return this.repositoryService.get('products/get-paid-products-list', true)
            .pipe(
                map((data: any) => data as toolDetails[])
            );
    }
    // products/get-products-by-category/4b3c1bc8-d5eb-4060-83bf-8597ad6c6d50
    getProductsByCategory(categoryId: string): Observable<toolDetails[]> {
        return this.repositoryService.get(`products/get-products-by-category/${categoryId}`, true)
            .pipe(
                map((data: any) => data as toolDetails[])
            );
    }
}