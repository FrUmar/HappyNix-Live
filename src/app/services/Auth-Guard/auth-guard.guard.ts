import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
@Injectable({
    providedIn: 'root',
})
export class customerAuthGuard implements CanActivate {
    UserType: any;
    constructor(private accountService: AccountService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.UserType = this.accountService.getUserType();
        if (this.accountService.isLoggedIn == true && (this.UserType == 'Client')) {
            return true;
        } else {
            let _url = `/auth/login`;
            this.router.navigate([_url]);
        }
        return true;
    }
}

@Injectable({
    providedIn: 'root',
})
export class adminAuthGuard implements CanActivate {
    UserType: any;
    constructor(private accountService: AccountService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.UserType = this.accountService.getUserType();
        if (this.accountService.isLoggedIn == true && (this.UserType == 'Admin')) {
            return true;
        } else {
            let _url = `/auth/login`;
            this.router.navigate([_url]);
        }
        return true;
    }
}
