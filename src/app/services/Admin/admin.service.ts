import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { RepositoryService } from '../repository/repository.service';
export class AuthenticateModel {
    email!: string;
    password!: string;
}
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
    getCategories() {
        return this.repositoryService.get('Admin/categories', true)
            .pipe(
                map((data: any) => {
                    return data;
                })
            );
    }
    // Auth/users-with-roles
    getUsersWithRoles() {
        return this.repositoryService.get('Admin/users-with-roles', true)
            .pipe(
                map((data: any) => {
                    return data;
                })
            );
    }
}