import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

interface User {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
}

interface Order {
  orderId: string;
  date: string;
  item: string;
  price: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User = {
    name: 'Cipher',
    email: 'cipher@cybercore.io',
    avatar: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg',
    bio: 'Netrunner, code-slinger, and ghost in the machine. I navigate the digital highways, looking for the next big score. If it\'s encrypted, I can crack it.',
    joinedDate: '2023-01-15'
  };

  orders: Order[] = [
    { orderId: 'ORD-7C4A1B', date: '2024-05-10', item: 'Ghost Cloaker', price: 500, status: 'Pending' },
    { orderId: 'ORD-9F2D8E', date: '2024-04-22', item: 'Zero-Day Exploit Kit', price: 50, status: 'Completed' },
    { orderId: 'ORD-3B6E7A', date: '2024-03-15', item: 'Port Scanner', price: 150, status: 'Completed' },
    { orderId: 'ORD-1A9C5F', date: '2024-02-01', item: 'AI Phisher', price: 0, status: 'Failed' }
  ];

  activeTab: 'profile' | 'orders' = 'profile';

  constructor(private location: Location) { }

  ngOnInit(): void { }

  setActiveTab(tab: 'profile' | 'orders') {
    this.activeTab = tab;
  }

  updateProfile() {
    console.log('Updating profile...', this.user);
    // Add logic to save user data to a backend service
  }
  goBack(): void {
    this.location.back();
  }
}