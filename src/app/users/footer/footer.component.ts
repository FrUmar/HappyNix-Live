import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  email: string = '';

  subscribe(): void {
    if (this.email) {
      // Placeholder for newsletter subscription logic
      alert(`Subscribed with ${this.email}`);
      this.email = '';
    } else {
      alert('Please enter a valid email address');
    }
  }
}
