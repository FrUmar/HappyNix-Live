import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tool {
  id: number;
  name: string;
  description: string;
  image: string;
  type: 'Free' | 'Paid';
  price?: number;
  downloadLink?: string;
  descriptionImages: string[];
}

@Component({
  selector: 'app-my-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-tools.component.html',
  styleUrl: './my-tools.component.scss'
})
export class MyToolsComponent {
  tools: Tool[] = [
    {
      id: 1,
      name: 'Port Scanner',
      description: 'A basic tool to scan for open ports on a target system. Fast and reliable.',
      image: 'https://api.dicebear.com/8.x/icons/svg?seed=radar&backgroundColor=232831&iconColor=00a8ff',
      type: 'Free',
      downloadLink: '/downloads/port-scanner.zip',
      descriptionImages: [
        'https://via.placeholder.com/400x200/232831/e0e0e0?text=Scanner+UI',
        'https://via.placeholder.com/400x200/232831/e0e0e0?text=Results+View'
      ]
    },
    {
      id: 2,
      name: 'Ghost Cloaker',
      description: 'Become completely anonymous with our advanced cloaking technology. Uses a multi-hop proxy chain.',
      image: 'https://api.dicebear.com/8.x/icons/svg?seed=ghost&backgroundColor=232831&iconColor=00a8ff',
      type: 'Paid',
      price: 49.99,
      descriptionImages: [
        'https://via.placeholder.com/400x200/232831/e0e0e0?text=Dashboard',
        'https://via.placeholder.com/400x200/232831/e0e0e0?text=Connection+Map',
        'https://via.placeholder.com/400x200/232831/e0e0e0?text=Settings'
      ]
    }
  ];

  isEditing = false;
  currentTool: Tool = this.getEmptyTool();
  descriptionImagesString: string = '';

  private getEmptyTool(): Tool {
    return { id: 0, name: '', description: '', image: '', type: 'Free', descriptionImages: [] };
  }

  selectTool(tool: Tool): void {
    this.isEditing = true;
    this.currentTool = { ...tool };
    this.descriptionImagesString = tool.descriptionImages.join(', ');
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentTool = this.getEmptyTool();
    this.descriptionImagesString = '';
  }

  saveTool(): void {
    this.currentTool.descriptionImages = this.descriptionImagesString.split(',').map(url => url.trim()).filter(url => url);
    if (this.isEditing) {
      const index = this.tools.findIndex(t => t.id === this.currentTool.id);
      if (index !== -1) this.tools[index] = this.currentTool;
    } else {
      this.currentTool.id = this.tools.length > 0 ? Math.max(...this.tools.map(t => t.id)) + 1 : 1;
      this.tools.push(this.currentTool);
    }
    this.resetForm();
  }

  deleteTool(id: number): void {
    this.tools = this.tools.filter(t => t.id !== id);
    if (this.currentTool.id === id) this.resetForm();
  }
}