import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { MatrixRainComponent } from './matrix-rain/matrix-rain.component';
import { filter } from 'rxjs';
import { UserService } from '../services/User/user.service';
import { AccountService } from '../services/account/account.service';

@Component({
  selector: 'app-users',
  imports: [RouterOutlet, CommonModule, MatrixRainComponent, RouterModule, FooterComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  isMenuOpen = false;
  isInProfilePage = false;
  user = {
    isLoggedIn: false,
    name: 'Name',
    avatar: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg'
  };
  constructor(private router: Router, private userService: UserService, private accountService: AccountService) {
    this.isLoginUser();
  }
  ngOnInit() {
    this.getUserDetails();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isLoginUser();
        this.isMenuOpen = false;
        this.isInProfilePage = this.router.url.includes('profile');
      });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isLoginUser() {
    const expiration = new Date(localStorage.getItem('exploits_expiration') ?? '');
    this.user.isLoggedIn =
      !!localStorage.getItem('exploits_access_token') &&
      !!localStorage.getItem('exploits_userId') &&
      expiration >= new Date();
  }
  getUserDetails() {
    this.userService.getUserProfile().subscribe((res: any) => {
      this.user.name = res.name;
      // this.user.avatar = res.avatar;
    });
  }
  public Logout() {
    this.accountService.doLogout();
  }
}
