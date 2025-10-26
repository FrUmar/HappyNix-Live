import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminCategory } from '../../models/admin';
import { toolDetails } from '../../models/user';
import { UserService } from '../User/user.service';

@Injectable({
    providedIn: 'root'
})
export class UserCacheService {
    private categoriesSubject = new BehaviorSubject<AdminCategory[] | null>(null);
    private freeToolsSubject = new BehaviorSubject<toolDetails[] | null>(null);
    private paidToolsSubject = new BehaviorSubject<toolDetails[] | null>(null);

    constructor(private userService: UserService) { }

    /** ✅ Get cached categories or load from API once */
    getCategoryNameList(): Observable<AdminCategory[]> {
        if (this.categoriesSubject.value) {
            return of(this.categoriesSubject.value);
        }
        return this.userService.getCategoryNameList().pipe(
            tap(data => this.categoriesSubject.next(data))
        );
    }

    /** ✅ Get cached free tools or load from API once */
    getFreeProductsList(): Observable<toolDetails[]> {
        if (this.freeToolsSubject.value) {
            return of(this.freeToolsSubject.value);
        }
        return this.userService.getFreeProductsList().pipe(
            tap(data => this.freeToolsSubject.next(data))
        );
    }

    /** ✅ Get cached paid tools or load from API once */
    getPaidProductsList(): Observable<toolDetails[]> {
        if (this.paidToolsSubject.value) {
            return of(this.paidToolsSubject.value);
        }
        return this.userService.getPaidProductsList().pipe(
            tap(data => this.paidToolsSubject.next(data))
        );
    }

    /** 🔄 Clear cache when data changes (e.g., admin adds tool/category) */
    clearCache(): void {
        this.categoriesSubject.next(null);
        this.freeToolsSubject.next(null);
        this.paidToolsSubject.next(null);
    }
}
