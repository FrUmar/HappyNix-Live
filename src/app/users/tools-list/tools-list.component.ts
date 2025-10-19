import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Tool {
  toolId: number;
  icon: string;
  name: string;
  description: string;
  isFree: boolean;
  price: number;
  downloadLink: string;
}

@Component({
  selector: 'app-tools-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tools-list.component.html',
  styleUrls: ['./tools-list.component.scss', '../dashboard/dashboard.component.scss']
})
export class ToolsListComponent {
  @ViewChildren('animatedSection', { read: ElementRef }) animatedSections!: QueryList<ElementRef>;
  private observer?: IntersectionObserver;
  private sliderInterval?: ReturnType<typeof setInterval>;
  paramName: string = '';
  tools: Tool[] = [
    {
      toolId: 1,
      icon: 'https://hackersonlineclub.com/wp-content/uploads/2020/03/Port-Scanning.png',
      name: 'Port Scanner',
      description: 'A basic tool to scan for open ports on a target system.',
      isFree: false,
      price: 150,
      downloadLink: '#'
    },
    {
      toolId: 2,
      icon: 'https://prod.ifacet.in/images/uploads/basic-quantum-programming-1751535338126.jpg',
      name: 'Wi-Fi Cracker',
      description: 'A simple WPA/WPA2 password cracker for educational purposes.',
      isFree: true,
      price: 0,
      downloadLink: '#'
    },
    {
      toolId: 3,
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTONrp_VqP1hIBL6Wm8XGm4z2iofoPkRuLyTw&s',
      name: 'Zero-Day Exploit Kit',
      description: 'A comprehensive kit with the latest zero-day exploits.',
      isFree: false,
      price: 50,
      downloadLink: '#'
    },
    {
      toolId: 4,
      icon: 'https://mobileimages.lowes.com/productimages/7d3df928-b690-4670-91e5-09b65ec21d68/67150973.jpeg',
      name: 'Ghost Cloaker',
      description: 'Become completely anonymous with our advanced cloaking technology.',
      isFree: false,
      price: 500,
      downloadLink: '#'
    },
    {
      toolId: 5,
      icon: 'https://image-optimizer.cyberriskalliance.com/unsafe/1920x0/https://files.cyberriskalliance.com/wp-content/uploads/2023/07/0725_phishing.jpg',
      name: 'AI Phisher',
      description: 'Automated phishing campaigns with social engineering AI.',
      isFree: true,
      price: 0,
      downloadLink: '#'
    }
  ];

  filter: 'all' | 'free' | 'paid' = 'all';
  viewMode: 'grid' | 'list' = 'grid';

  get filteredTools(): Tool[] {
    return this.tools.filter(tool => {
      if (this.filter === 'free') return tool.isFree;
      if (this.filter === 'paid') return !tool.isFree;
      return true;
    });
  }

  constructor(private route: ActivatedRoute) {
    this.paramName = this.route.snapshot.paramMap.get('toolId') || '';
  }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    this.animatedSections.forEach(section => {
      this.observer?.observe(section.nativeElement);
    });
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }
}