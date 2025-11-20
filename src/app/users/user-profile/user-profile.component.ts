import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { userDetails } from '../../models/user';
import { UserCacheService } from '../../services/UserCacheData/userCacheService';

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
  user: userDetails = {
    id: '',
    name: '',
    phoneNumber: '',
    avatarUrl: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg',
    email: '',
    createdAt: '',
    applicationUserTypeId: 0
  };

  orders: Order[] = [
    { orderId: 'ORD-7C4A1B', date: '2024-05-10', item: 'Ghost Cloaker', price: 500, status: 'Pending' },
    { orderId: 'ORD-9F2D8E', date: '2024-04-22', item: 'Zero-Day Exploit Kit', price: 50, status: 'Completed' },
    { orderId: 'ORD-3B6E7A', date: '2024-03-15', item: 'Port Scanner', price: 150, status: 'Completed' },
    { orderId: 'ORD-1A9C5F', date: '2024-02-01', item: 'AI Phisher', price: 0, status: 'Failed' }
  ];

  activeTab: 'profile' | 'orders' = 'profile';

  constructor(private location: Location, private userCacheService: UserCacheService) { }

  ngOnInit(): void {
    this.getUserProfile()
  }

  setActiveTab(tab: 'profile' | 'orders') {
    this.activeTab = tab;
  }
  getUserProfile(): void {
    this.userCacheService.getUserProfile().subscribe(current => {
      this.user = {
        id: current.id,
        name: current.name,
        phoneNumber: current.phoneNumber,
        avatarUrl: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg',
        email: current.email,
        createdAt: current.createdAt,
        applicationUserTypeId: current.applicationUserTypeId
      };
    });
  }
  updateProfile() {
    console.log('Updating profile...', this.user);
    // Add logic to save user data to a backend service
  }
  goBack(): void {
    this.location.back();
  }
}