import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminRouting } from "../../admin/admin-routing";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminRouting, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router) { }

  login() {
    // Placeholder for login logic. On success, you would navigate.
    this.router.navigate(['/dashboard']);
  }
}
