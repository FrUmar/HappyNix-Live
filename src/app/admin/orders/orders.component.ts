import { AdminService } from './../../services/Admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OrderItem {
  toolId: number;
  toolName: string;
  quantity: number;
  price: number;
}

interface DownloadActivity {
  customerName: string;
  toolName: string;
  downloadDate: Date;
  orderId: string;
}

type OrderStatus = 'Completed' | 'Pending' | 'Failed' | 'Processing';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  currentFilter: OrderStatus | 'All' = 'All';
  orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Completed', 'Failed'];
  isLoading = false;

  downloadActivities: DownloadActivity[] = [
    { customerName: 'John Doe', toolName: 'Ghost Cloaker', downloadDate: new Date('2024-05-20T10:00:00Z'), orderId: 'ORD123' },
    { customerName: 'Sam Fisher', toolName: 'Port Scanner', downloadDate: new Date('2024-05-21T11:00:00Z'), orderId: 'ORD126' },
    { customerName: 'John Doe', toolName: 'Ghost Cloaker', downloadDate: new Date('2024-05-21T12:30:00Z'), orderId: 'ORD123' },
  ];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getOrderList(null);
  }
  getOrderList(statusId: number | null) {
    this.isLoading = true;
    this.filteredOrders = [];
    this.selectedOrder = null;

    switch (statusId) {
      case 1: this.currentFilter = 'Pending'; break;
      case 2: this.currentFilter = 'Processing'; break;
      case 3: this.currentFilter = 'Completed'; break;
      case 4: this.currentFilter = 'Failed'; break;
      default: this.currentFilter = 'All';
    }

    let filter = {
      pageNumber: 1,
      pageSize: 10,
      statusId: statusId
    }
    this.adminService.getAllOrders(filter).subscribe((response) => {
      this.allOrders = response.orders.map((order: any) => ({
        id: order.id,
        customerName: order.userName,
        customerEmail: order.userEmail,
        date: new Date(order.createdAt),
        status: order.statusName,
        total: order.amount,
        items: [{
          toolId: 0, // Not available in API response
          toolName: order.productName,
          quantity: 1, // Assuming 1
          price: order.amount
        }]
      }));
      this.filteredOrders = [...this.allOrders];
      this.filteredOrders.sort((a, b) => b.date.getTime() - a.date.getTime());
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  selectOrder(order: Order): void {
    this.selectedOrder = order;
  }

  clearSelection(): void {
    this.selectedOrder = null;
  }

  updateOrderStatus(newStatus: OrderStatus): void {
    if (!this.selectedOrder) return;

    // Here you would typically call a service to update the order on the backend.
    // For now, we'll just update the local state.
    this.selectedOrder.status = newStatus;

    const indexInAll = this.allOrders.findIndex(o => o.id === this.selectedOrder!.id);
    if (indexInAll !== -1) {
      this.allOrders[indexInAll].status = newStatus;
    }

    // If the current filter is not 'All' and the status changed, the item might disappear from the list.
    if (this.currentFilter !== 'All' && this.currentFilter !== newStatus) {
      this.filteredOrders = this.filteredOrders.filter(o => o.id !== this.selectedOrder!.id);
      this.clearSelection();
    } else {
      const indexInFiltered = this.filteredOrders.findIndex(o => o.id === this.selectedOrder!.id);
      if (indexInFiltered !== -1) {
        this.filteredOrders[indexInFiltered].status = newStatus;
      }
    }
  }
}