import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AccountService } from '../services/account/account.service';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor(private accountService: AccountService) { }
  public Logout() {
    this.accountService.doLogout();
  }
}
