import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { RepositoryService } from '../repository/repository.service';
import { UserCacheService } from '../UserCacheData/userCacheService';
export class AuthenticateModel {
  email!: string;
  password!: string;
}
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  history: any[] = [];
  constructor(
    private router: Router,
    private repositoryService: RepositoryService,
    private userCacheService: UserCacheService
  ) { }

  AddUser(data: any) {
    return this.repositoryService.post('Auth/user-signup', data, false).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  checkUserEmailExistence(email: any) {
    return this.repositoryService.get('Auth/check-user-email-existence?email=' + email, true)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
  login(authenticateModel: AuthenticateModel) {
    return this.repositoryService.post('Auth/login', authenticateModel, false).pipe(
      map((user: any) => {
        localStorage.setItem('exploits_access_token', user.token);
        localStorage.setItem('exploits_userId', user.id);
        localStorage.setItem('exploits_user_role', user.role);
        localStorage.setItem('exploits_expiration', user.expiration);
        localStorage.setItem('exploits_user_name', user.userName);
        localStorage.setItem('exploits_user_clientId', user.clientId);
        localStorage.setItem('exploits_user_getClientTypeId', user.clientTypeId);
        localStorage.setItem('exploits_user_clientLogo', user.clientLogo);
        return user;
      })
    );
  }
  //Auth/user-signup
  signUpUser(data: any) {
    return this.repositoryService.post('Auth/register', data, false).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  addClientDueDiligence(data: any) {
    return this.repositoryService.postWithFile('Auth/add-client-due-diligence', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getPreviousUrl(): string | null {
    if (this.history.length > 1) {
      console.log('Previous URL');
      return this.history[this.history.length - 2];
    }
    console.log('Not Previous URL');
    return null;
  }
  getUserType() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      return localStorage.getItem('exploits_user_role');
    }
    return null;
  }
  getUserId() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      return localStorage.getItem('exploits_userId');
    }
    return null;
  }
  getUserLogo() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      return localStorage.getItem('exploits_user_clientLogo');
    }
    return null;
  }
  getClientTypeId() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      return localStorage.getItem('exploits_user_getClientTypeId');

    }
    return null;
  }
  getClientId() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      return localStorage.getItem('exploits_user_clientId');
    }
    return null;
  }
  getUserName() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      return localStorage.getItem('exploits_user_name');
    }
    return null;
  }
  getToken() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      return localStorage.getItem('exploits_access_token');
    }
    return null;
  }
  get isLoggedIn(): boolean {
    let authToken = null;
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      authToken = localStorage.getItem('exploits_access_token');
    }
    return authToken !== null ? true : false;
  }
  doLogoutForLogin() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      let removeToken = localStorage.removeItem(
        'exploits_access_token'
      );
      let removeUserType = localStorage.removeItem(
        'exploits_user_role'
      );
      let removeUserId = localStorage.removeItem('exploits_userId');
      let removeClientId = localStorage.removeItem('exploits_user_clientId');
      if (
        removeToken == null &&
        removeUserType == null &&
        removeUserId == null &&
        removeClientId == null
      ) {
        this.router.navigateByUrl(`/auth/signIn`);
      }
    }
  }
  doLogout() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      let removeToken = localStorage.removeItem(
        'exploits_access_token'
      );
      let removeUserType = localStorage.removeItem(
        'exploits_user_role'
      );
      let removeExpiration = localStorage.removeItem(
        'exploits_expiration'
      );
      this.userCacheService.clearCacheUserDetails()
      let removeUserId = localStorage.removeItem('exploits_userId');
      let removeUserName = localStorage.removeItem('exploits_user_name');
      let removeClientId = localStorage.removeItem('exploits_user_clientId');
      let removeClientLogo = localStorage.removeItem('exploits_user_clientLogo');

      if (
        removeToken == null &&
        removeUserType == null && removeUserName == null &&
        removeUserId == null && removeClientId == null && removeClientLogo == null
      ) {
        this.router.navigateByUrl(`/auth/login`);
      }
    }
  }
}
