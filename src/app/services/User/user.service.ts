import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { RepositoryService } from '../repository/repository.service';
import { AdminCategory } from '../../models/admin';
import { Observable } from 'rxjs';
import { toolDetails } from '../../models/user';
import Swal from 'sweetalert2';
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
    // User/update-profile
    updateUserProfile(changes: Partial<any>) {
        return this.repositoryService.put('User/update-profile', changes)
            .pipe(
                map((data: any) => {
                    return data;
                })
            );
    }
    // User/create-order
    createOrder(orderData: any): Observable<any> {
        return this.repositoryService.post('User/create-order', orderData, true)
            .pipe(
                map((data: any) => {
                    return data;
                })
            );
    }
    // User/orders-history
    getUserOrdersHistory() {
        return this.repositoryService.get('User/orders-history', true)
            .pipe(
                map((data: any) => {
                    return data;
                })
            );
    }
    Toast = (icon: any, title: any) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: icon,
            title: title
        });
    }
    // products/search-products?query=ai%20p
    searchProducts(query: string): Observable<toolDetails[]> {
        return this.repositoryService.get(`products/search-products?query=${encodeURIComponent(query)}`, true)
            .pipe(
                map((data: any) => data as toolDetails[])
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