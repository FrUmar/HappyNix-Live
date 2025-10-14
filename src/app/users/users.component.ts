import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { MatrixRainComponent } from './matrix-rain/matrix-rain.component';
@Component({
  selector: 'app-users',
  imports: [RouterOutlet, CommonModule, MatrixRainComponent, RouterModule, FooterComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  isMenuOpen = false;
  user = {
    isLoggedIn: false,
    name: 'Cipher',
    avatar: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg'
  };

}
