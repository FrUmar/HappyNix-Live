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
}