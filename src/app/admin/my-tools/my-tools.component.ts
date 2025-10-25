import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProduct, AdminProductPayload, AdminCategory } from '../../models/admin';
import { AdminService } from '../../services/Admin/admin.service';
import { finalize } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-tools.component.html',
  styleUrls: ['./my-tools.component.scss', '../admin.component.scss']
})
export class MyToolsComponent implements OnInit {
  tools: AdminProduct[] = [];
  categories: AdminCategory[] = [];
  isLoading = false;
  isEditing = false;
  currentTool: Partial<AdminProduct> = this.getEmptyTool();
  newFeature: string = '';

  constructor(private adminService: AdminService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadTools();
    this.loadCategories();
  }

  loadTools(): void {
    this.isLoading = true;
    this.adminService.getProductsList()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.tools = data;
          this.tools.forEach(tool => {
            tool.releaseDate = new Date(tool.releaseDate).toISOString().split('T')[0];
          });
        },
        error: (err) => console.error('Error fetching tools:', err)
      });
  }

  loadCategories(): void {
    this.adminService.getCategoryList().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }


  private resetFormState(): void {
    this.isEditing = false;
    this.currentTool = this.getEmptyTool();
  }

  private getEmptyTool(): AdminProductPayload {
    return {
      name: '',
      shortDescription: '',
      longDescription: '',
      mainImage: '',
      isFree: true,
      isPaid: false,
      downloadLink: '',
      price: 0,
      version: '',
      releaseDate: new Date().toISOString().split('T')[0],
      features: [], // ✅ array instead of string
      videoLink: '',
      categoryId: ''
    };
  }

  openToolModal(modal: any, tool?: AdminProduct): void {
    if (tool) {
      this.isEditing = true;
      this.currentTool = { ...tool, releaseDate: new Date(tool.releaseDate).toISOString().split('T')[0] };

      if (typeof this.currentTool.features === 'string') {
        this.currentTool.features = (this.currentTool.features as string).split(',')
          .map(f => f.trim())
          .filter(f => f);
      }
    } else {
      this.isEditing = false;
      this.currentTool = this.getEmptyTool();
    }

    this.modalService.open(modal, { size: 'xl', centered: true, backdrop: 'static' }).result.then(
      () => { this.resetFormState(); },
      () => { this.resetFormState(); }
    );
  }

  saveTool(): void {
    if (!this.currentTool.name || !this.currentTool.categoryId) {
      console.error('Tool name and category are required.');
      return;
    }

    this.isLoading = true;

    const payload: AdminProductPayload = {
      ...this.currentTool,
      features: Array.isArray(this.currentTool.features)
        ? this.currentTool.features.join(', ')
        : this.currentTool.features || ''
    } as unknown as AdminProductPayload;

    const operation = this.isEditing && this.currentTool.productId
      ? this.adminService.updateProductDetail(this.currentTool.productId, payload)
      : this.adminService.addProduct(payload);

    operation.pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        this.loadTools();
        this.modalService.dismissAll();
      },
      error: (err) => console.error(`Failed to ${this.isEditing ? 'update' : 'add'} tool:`, err)
    });
  }


  deleteTool(id: string): void {
    if (!confirm('Are you sure you want to delete this tool?')) {
      return;
    }
    this.isLoading = true;
    this.adminService.deleteProduct(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.tools = this.tools.filter(t => t.productId !== id);
          if (this.currentTool.productId === id) {
            this.modalService.dismissAll();
          }
        },
        error: (err) => console.error('Failed to delete tool:', err)
      });
  }
  priceType: 'free' | 'paid' = 'free'; // default selection


  onPriceTypeChange(type: 'free' | 'paid') {
    if (type === 'free') {
      this.currentTool.isFree = true;
      this.currentTool.isPaid = false;
      this.currentTool.price = 0;
    } else {
      this.currentTool.isFree = false;
      this.currentTool.isPaid = true;
    }
  }


  addFeature() {
    const trimmed = this.newFeature.trim();
    if (trimmed && !this.currentTool?.features?.includes(trimmed)) {
      this.currentTool.features?.push(trimmed);
    }
    this.newFeature = ''; // clear input
  }

  removeFeature(index: number) {
    this.currentTool.features?.splice(index, 1);
  }

}