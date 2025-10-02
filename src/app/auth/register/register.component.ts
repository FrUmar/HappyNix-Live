import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private router: Router) { }

  register() {
    // Placeholder for registration logic.
    console.log('Creating new user...');
    // On success, you might navigate to the login page:
    // this.router.navigate(['/auth/login']);
  }
}
