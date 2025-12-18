import { AdminService } from './../../services/Admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

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
interface download {
  orderId: string;
  userName: string;
  productName: string;
  createdAt: Date;
  statusName: string;
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
  downloadOrders: download[] = [];
  currentPage = 1;
  pageSize = 10;
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
    this.getUserDownload();
  }
  loadOrders(): void {

    this.isLoading = true;
    this.selectedOrder = null;

    const filter = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      statusId: null,
    };

    this.adminService.getAllOrders(filter).subscribe(
      (response: any) => {
        // --- KEY CHANGES START HERE ---
        const allFetchedOrders: Order[] = response.orders.map((order: any) => {

          // Safety check: find status by name, fallback to 'Pending' (index 0) if not found to prevent errors
          const matchedStatus = this.orderStatuses.find(s => s.type === order.statusName) || this.orderStatuses[0];

          return {
            id: order.orderId,               // JSON uses 'orderId', not 'id'
            customerName: order.userName,    // Matches JSON
            customerEmail: order.userEmail,  // Matches JSON
            date: new Date(order.createdAt), // Matches JSON
            status: matchedStatus,           // Logic adjusted for safety
            total: order.price,              // JSON uses 'price', not 'amount'
            paymentMethod: order.paymentMethod,
            items: [
              {
                toolId: 0,                   // Not in API, default to 0
                toolName: order.name,        // JSON uses 'name', not 'productName'
                quantity: 1,                 // Assumed 1
                price: order.price,          // JSON uses 'price', not 'amount'
              },
            ],
          };
        });
        // --- KEY CHANGES END HERE ---

        // this.downloadOrders = allFetchedOrders
        //   .filter((order) => order.status.type === 'Download')
        //   .sort((a, b) => b.date.getTime() - a.date.getTime());

        this.allOrders = allFetchedOrders

        this.applyFilter();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading orders', error);
        this.isLoading = false;
      }
    );

  }

  getUserDownload() {
    this.adminService.getRecentDownloads().subscribe(dt => {
      for (let a = 0; a < dt.length; a++) {

        let data = {
          orderId: dt[a].orderId,
          userName: dt[a].userName,
          productName: dt[a].name,
          createdAt: new Date(dt[a].createdAt),
          statusName: dt[a].statusName

        };
        this.downloadOrders.push(data);
      }

    });
  }

  applyFilter(): void {
    if (this.currentFilter === 'All') {
      this.filteredOrders = [...this.allOrders];
    } else {
      this.filteredOrders = this.allOrders.filter((o) => o.status === this.currentFilter);
    }
    this.filteredOrders.sort((a, b) => b.date.getTime() - a.date.getTime());
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
      next: (rec) => {
        this.selectedOrder!.status = newStatus;
        this.applyFilter();
        this.modalService.dismissAll();
        if (rec.statusCode === 200) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Order status updated successfully"
          });
        }
      },
      error: (error) => {
        console.error('Error updating order status', error);
      }
    });
  }


  // Add this getter to handle the slicing logic
  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(startIndex, startIndex + this.pageSize);
  }

  // Add this to reset page when filtering
  filterBy(statusType: string): void {
    this.currentPage = 1; // Reset to page 1 on new filter
    this.currentFilter = statusType === 'All'
      ? 'All'
      : this.orderStatuses.find(s => s.type === statusType)!;
    this.applyFilter();
  }
  // Helper for total pages
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }
}