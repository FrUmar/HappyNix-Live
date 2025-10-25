import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminCategory } from '../../models/admin';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../services/Admin/admin.service';

// It's a good practice to define a type for the object used in the form.
// This payload seems to match the commented out JSON in the original `resetForm`.
interface CategoryPayload {
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  userId: string;
}

@Component({
  selector: 'app-cetagorys',
  standalone: true, // The 'imports' property makes this a standalone component.
  imports: [CommonModule, FormsModule],
  templateUrl: './cetagorys.component.html',
  styleUrls: ['./cetagorys.component.scss', '../admin.component.scss']
})
export class CetagorysComponent implements OnInit {
  categories: AdminCategory[] = [];
  isLoading = false;
  isEditing = false;
  currentCategory: Partial<CategoryPayload> = this.getEmptyCategory();

  constructor(private adminService: AdminService, private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.adminService.getCategoryList()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data: AdminCategory[]) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Error fetching categories:', err);
        }
      });
  }



  resetForm(): void {
    this.isEditing = false;
    this.currentCategory = this.getEmptyCategory();
  }

  saveCategory(): void {
    if (this.isEditing && this.currentCategory.categoryId) {
      this.isLoading = true;
      this.adminService.updateCategoryInfo(this.currentCategory.categoryId, this.currentCategory as CategoryPayload)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.resetForm();
        }))
        .subscribe({
          next: (updatedCategory: AdminCategory) => {
            const index = this.categories.findIndex(c => c.categoryId === updatedCategory.categoryId);
            if (index !== -1) {
              this.categories[index] = updatedCategory;
            } else {
              // If not found, reload the list to ensure data consistency
              this.loadCategories();
            }
            this.CancelPopUp()
          },
          error: (err) => console.error('Failed to update category:', err)
        });
    }
  }

  private getEmptyCategory(): Partial<CategoryPayload> {
    return {
      name: '',
      description: '',
      imageUrl: '',
      userId: 'string',
    };
  }
  CancelPopUp() {
    this.modalService.dismissAll();
  }
  OpenPopUp(notificationModal: any, category: AdminCategory): void {
    this.isEditing = true;
    this.currentCategory = {
      categoryId: category.categoryId,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      userId: "string", // This seems to be a placeholder for the current user's ID
    };
    this.modalService.open(notificationModal, {
      size: 'md',
      centered: true,
      backdrop: 'static',
    });
  }
}
