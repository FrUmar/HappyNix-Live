import { AdminService } from './../../services/Admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface OrderItem {
  toolId: number;
  toolName: string;
  quantity: number;
  price: number;
}


interface OrderStatus {
  id: number;
  type: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  paymentMethod?: string;
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
  downloadOrders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  currentFilter: OrderStatus | 'All' = 'All';
  orderStatuses: OrderStatus[] = [
    { id: 1, type: 'Pending' },
    { id: 2, type: 'Processing' },
    { id: 3, type: 'Completed' },
    { id: 4, type: 'Failed' },
    { id: 5, type: 'Cancelled' },
    { id: 6, type: 'Refunded' },
    { id: 7, type: 'Download' },
  ];
  isLoading = false;

  constructor(private adminService: AdminService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders(): void {
    this.isLoading = true;
    this.selectedOrder = null;

    const filter = {
      pageNumber: 1,
      pageSize: 100, // Fetch more for client-side filtering
      statusId: null,
    };

    this.adminService.getAllOrders(filter).subscribe(
      (response) => {
        const allFetchedOrders: Order[] = response.orders.map((order: any) => ({
          id: order.id,
          customerName: order.userName,
          customerEmail: order.userEmail,
          date: new Date(order.createdAt),
          status: this.orderStatuses.find(s => s.type === order.statusName)!,
          total: order.amount,
          paymentMethod: order.paymentMethod,
          items: [
            {
              toolId: 0, // Not available in API response
              toolName: order.productName,
              quantity: 1, // Assuming 1
              price: order.amount,
            },
          ],
        }));

        this.downloadOrders = allFetchedOrders
          .filter((order) => order.status.type === 'Download')
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        this.allOrders = allFetchedOrders.filter((order) => order.status.type !== 'Download');

        this.applyFilter();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  applyFilter(): void {
    if (this.currentFilter === 'All') {
      this.filteredOrders = [...this.allOrders];
    } else {
      this.filteredOrders = this.allOrders.filter((o) => o.status === this.currentFilter);
    }
    this.filteredOrders.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  filterBy(statusType: string): void {
    this.currentFilter = statusType === 'All'
      ? 'All'
      : this.orderStatuses.find(s => s.type === statusType)!;
    this.applyFilter();
  }

  openToolModal(modal: any, order: Order): void {

    this.selectedOrder = order;
    this.modalService.open(modal, { size: 'md', centered: true, backdrop: 'static' }).result.then(
      () => { this.clearSelection(); },
      () => { this.clearSelection(); }
    );
  }

  clearSelection(): void {
    this.selectedOrder = null;
  }

  updateOrderStatus(newStatusType: string): void {
    if (!this.selectedOrder) return;
    const newStatus = this.orderStatuses.find(s => s.type === newStatusType);
    if (!newStatus) return;

    const body = {
      orderId: this.selectedOrder.id,
      statusId: newStatus.id
    };
    this.adminService.updateOrderStatus(body).subscribe({
      next: () => {
        this.selectedOrder!.status = newStatus;
        this.applyFilter();
      }
    });
  }
}