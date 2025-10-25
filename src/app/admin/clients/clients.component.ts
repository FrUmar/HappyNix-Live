import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/Admin/admin.service';
import { AdminUserWithRole } from '../../models/admin';
import { finalize, map } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  isLoading = false;
  clients: AdminUserWithRole[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.adminService.getUserRoles()
      .pipe(
        map(users => users
          .filter(user => user.role === 'Client')
          .map(user => ({
            ...user,
            isNew: this.checkIfNew(user.createdAt)
          }))
        ),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (clients) => {
          this.clients = clients;
        },
        error: (err) => console.error('Error fetching clients:', err)
      });
  }

  private checkIfNew(createdAt: string): boolean {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7; // within a week
  }

  selectClient(client: AdminUserWithRole) {
    console.log('Selected Client:', client);
  }
}
