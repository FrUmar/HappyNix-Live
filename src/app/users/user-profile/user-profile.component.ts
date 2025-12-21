import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { userDetails } from '../../models/user';
import { UserCacheService } from '../../services/UserCacheData/userCacheService';
import { UserService } from '../../services/User/user.service';
import { AccountService } from '../../services/account/account.service';

interface User {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
}

// "orderId": "4bb2360e-e1cf-41bb-f441-08de3e4b0dcb",
// "userId": "dc024044-6c2a-451f-aa41-416dc5a223d0",
// "paymentMethod": "Download",
// "createdAt": "2025-12-18T15:35:20.787",
// "statusId": 7,
// "name": "WiFi Crackers ",
// "productId": "f5fd1d12-313f-4bdf-979d-8874250dab0e",
// "price": 50.00,
// "statusName": "Download"
interface Order {
  orderId: string;
  userId: string;
  paymentMethod: string;
  amount: number;
  createdAt: string;
  statusId: number;
  statusName: string;
  name: string;
  price: number;
  productId: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  orderLoading: boolean = false;
  user: userDetails = {
    id: '',
    name: '',
    phoneNumber: '',
    avatarUrl: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg',
    email: '',
    createdAt: '',
    applicationUserTypeId: 0
  };
  isUpdating: boolean = false;
  orders: Order[] = [];

  activeTab: 'profile' | 'orders' = 'profile';

  constructor(private location: Location, private userCacheService: UserCacheService, private userService: UserService, private accountService: AccountService, private router: Router,) { }

  ngOnInit(): void {
    let userid = this.accountService.getUserId();
    if (!userid) {
      this.router.navigateByUrl(`/auth/login`);
      return;
    }
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
    this.isUpdating = true;
    // Add logic to save user data to a backend service
    let data = {
      name: this.user.name,
      phoneNumber: this.user.phoneNumber
    }
    this.userService.updateUserProfile(data).subscribe(response => {
      this.isUpdating = false;
      this.userCacheService.patchUserProfile(data);
      this.userService.Toast('success', 'Profile updated successfully');
    }, error => {
      this.isUpdating = false;
      this.userService.Toast('error', 'Failed to update profile');
    }
    );
  }
  getUserOrdersHistory(): void {
    this.orderLoading = true;
    this.userService.getUserOrdersHistory().subscribe(response => {
      // Map the response to the Order interface if necessary
      this.orders = response.map((order: any) => ({
        orderId: order.orderId,
        userId: order.userId,
        paymentMethod: order.paymentMethod,
        amount: order.amount,
        createdAt: order.createdAt,
        statusId: order.statusId,
        statusName: order.statusName,
        name: order.name,
        price: order.price,
        productId: order.productId
      }));
      this.orderLoading = false;
    }, error => {

      this.orderLoading = false;
    });
  }

  goBack(): void {
    this.location.back();
  }
}