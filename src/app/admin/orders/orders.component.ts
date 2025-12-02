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

interface DownloadActivity {
  customerName: string;
  toolName: string;
  downloadDate: Date;
  orderId: string;
}
type OrderStatus = 'Completed' | 'Pending' | 'Failed' | 'Processing' | 'Download';

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
  orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Completed', 'Failed'];
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
          status: order.statusName,
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
          .filter((order) => order.status === 'Download')
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        this.allOrders = allFetchedOrders.filter((order) => order.status !== 'Download');

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

  filterBy(status: OrderStatus | 'All'): void {
    this.currentFilter = status;
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