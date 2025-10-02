import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
  image: string;
  productCount: number;
}

@Component({
  selector: 'app-cetagorys',
  imports: [CommonModule, FormsModule],
  templateUrl: './cetagorys.component.html',
  styleUrl: './cetagorys.component.scss'
})
export class CetagorysComponent {
  categories: Category[] = [
    { id: 1, name: 'RATs', image: 'https://api.dicebear.com/8.x/icons/svg?seed=skull&backgroundColor=232831&iconColor=00a8ff', productCount: 12 },
    { id: 2, name: 'Remote Tools', image: 'https://api.dicebear.com/8.x/icons/svg?seed=network&backgroundColor=232831&iconColor=00a8ff', productCount: 8 },
    { id: 3, name: 'Monitoring', image: 'https://api.dicebear.com/8.x/icons/svg?seed=eye&backgroundColor=232831&iconColor=00a8ff', productCount: 5 },
    { id: 4, name: 'Educational', image: 'https://api.dicebear.com/8.x/icons/svg?seed=book&backgroundColor=232831&iconColor=00a8ff', productCount: 25 }
  ];

  isEditing = false;
  currentCategory: Category = this.getEmptyCategory();

  private getEmptyCategory(): Category {
    return { id: 0, name: '', image: '', productCount: 0 };
  }

  selectCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategory = { ...category };
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentCategory = this.getEmptyCategory();
  }

  saveCategory(): void {
    if (this.isEditing) {
      // Update existing category
      const index = this.categories.findIndex(c => c.id === this.currentCategory.id);
      if (index !== -1) {
        this.categories[index] = this.currentCategory;
      }
    } else {
      // Add new category
      this.currentCategory.id = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) + 1 : 1;
      this.categories.push(this.currentCategory);
    }
    this.resetForm();
  }

  deleteCategory(id: number): void {
    this.categories = this.categories.filter(c => c.id !== id);
    if (this.currentCategory.id === id) {
      this.resetForm();
    }
  }
}
