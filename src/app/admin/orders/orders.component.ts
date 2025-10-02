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

type OrderStatus = 'Completed' | 'Pending' | 'Failed' | 'Shipped';

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
  allOrders: Order[] = [
    {
      id: 'ORD123',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      date: new Date('2024-05-19T11:30:00Z'),
      status: 'Completed',
      items: [
        { toolId: 2, toolName: 'Ghost Cloaker', quantity: 1, price: 49.99 }
      ],
      total: 49.99
    },
    {
      id: 'ORD124',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      date: new Date('2024-05-20T15:00:00Z'),
      status: 'Pending',
      items: [
        { toolId: 1, toolName: 'Port Scanner', quantity: 1, price: 0 },
        { toolId: 2, toolName: 'Ghost Cloaker', quantity: 1, price: 29.99 }
      ],
      total: 29.99
    },
    {
      id: 'ORD125',
      customerName: 'Agent 47',
      customerEmail: 'agent.47@ica.org',
      date: new Date('2024-05-18T14:30:00Z'),
      status: 'Failed',
      items: [
        { toolId: 2, toolName: 'Ghost Cloaker', quantity: 2, price: 49.99 }
      ],
      total: 99.98
    },
    {
      id: 'ORD126',
      customerName: 'Sam Fisher',
      customerEmail: 'sam.fisher@third.echelon',
      date: new Date('2024-05-21T09:00:00Z'),
      status: 'Shipped',
      items: [
        { toolId: 1, toolName: 'Port Scanner', quantity: 1, price: 0 }
      ],
      total: 0.00
    }
  ];

  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  currentFilter: OrderStatus | 'All' = 'All';
  orderStatuses: OrderStatus[] = ['Pending', 'Shipped', 'Completed', 'Failed'];

  downloadActivities: DownloadActivity[] = [
    { customerName: 'John Doe', toolName: 'Ghost Cloaker', downloadDate: new Date('2024-05-20T10:00:00Z'), orderId: 'ORD123' },
    { customerName: 'Sam Fisher', toolName: 'Port Scanner', downloadDate: new Date('2024-05-21T11:00:00Z'), orderId: 'ORD126' },
    { customerName: 'John Doe', toolName: 'Ghost Cloaker', downloadDate: new Date('2024-05-21T12:30:00Z'), orderId: 'ORD123' },
  ];

  ngOnInit(): void {
    this.filterOrders('All');
  }

  filterOrders(status: OrderStatus | 'All'): void {
    this.currentFilter = status;
    this.filteredOrders = status === 'All' ? [...this.allOrders] : this.allOrders.filter(order => order.status === status);
    this.filteredOrders.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  selectOrder(order: Order): void {
    this.selectedOrder = order;
  }

  clearSelection(): void {
    this.selectedOrder = null;
  }

  updateOrderStatus(newStatus: OrderStatus): void {
    if (!this.selectedOrder) return;
    this.selectedOrder.status = newStatus;
    const indexInAll = this.allOrders.findIndex(o => o.id === this.selectedOrder!.id);
    if (indexInAll !== -1) this.allOrders[indexInAll].status = newStatus;
    this.filterOrders(this.currentFilter);
  }
}