import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-clients',
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  filters = ['All', 'Active', 'Pending', 'Inactive'];
  activeFilter = 'All';

  clients = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://randomuser.me/api/portraits/men/10.jpg',
      status: 'Active'
    },
    {
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      status: 'Pending'
    },
    {
      name: 'Michael Lee',
      email: 'michael@example.com',
      image: 'https://randomuser.me/api/portraits/men/14.jpg',
      status: 'Inactive'
    }
  ];

  selectClient(client: any) {
    console.log('Selected Client:', client);
  }
}
