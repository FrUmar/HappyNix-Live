import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-card-loading',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './card-loading.component.html',
  styleUrls: ['./card-loading.component.scss']
})
export class CardLoadingComponent {
  @Input() loop = 1; // default 1
  @Input() type = 1; // 1 = category, 2 = product
}
