import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardLoadingComponent } from "../../reuse/card-loading/card-loading.component";
import { UserService } from '../../services/User/user.service';
import { toolDetails } from '../../models/user';
import { forkJoin, Subscription } from 'rxjs';
import { AdminCategory } from '../../models/admin';
import { UserCacheService } from '../../services/UserCacheData/userCacheService';
import { BuyNowComponent } from '../buy-now/buy-now.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Define interfaces for better type safety
interface Slide {
  image: string;
  title: string;
  description: string;
}



interface VmwareTool {
  icon: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardLoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private behaviorSubject = inject(UserCacheService);

  slides: Slide[] = [
    {
      image: 'https://sectricity.com/wp-content/uploads/2023/05/Hacker-Cyber-Security-Internet-Sectricity.jpg',
      title: 'Quantum Injector',
      description: 'Bypass any firewall with our new quantum entanglement toolkit.'
    },
    {
      image: 'https://bif.telkomuniversity.ac.id/wp-content/uploads/2024/09/Apa-Itu-Ethical-Hacking-dan-Bagaimana-Menjadi-Seorang-Ethical-Hacker.jpeg',
      title: 'Cyberpunk 2077 Hacking Contest',
      description: 'Join now and win exclusive prizes!'
    },
    {
      image: 'https://www.wattlecorp.com/wp-content/uploads/2020/08/Top-7-ethical-hacking-tools.jpg',
      title: 'Neural Scrambler',
      description: 'Advanced social engineering tool powered by AI.'
    }
  ];

  categories: AdminCategory[] = [];
  freeTools: toolDetails[] = [];
  paidTools: toolDetails[] = [];

  categoriesLoading = true;
  toolsLoading = true;

  vmwareTools: VmwareTool[] = [
    {
      icon: '🖥️',
      title: 'Run Nearly Any Operating System, Virtually',
      description: 'Choose from hundreds of supported operating systems, from cloud-ready Linux distributions to the latest Windows 11, all without rebooting.',
      link: '#',
      linkText: 'Learn More'
    },
    {
      icon: '🛡️',
      title: 'Develop and Test for Any Platform',
      description: 'Support for VMs, containers, Kubernetes clusters, providing developers a versatile and automatable platform.',
      link: '#',
      linkText: 'Explore Features'
    },
    {
      icon: '🖥️',
      title: 'Connect to vSphere',
      description: 'Connect Fusion or Workstation to remote vSphere/ESX servers, launch/control/manage VMs, migrate to private cloud easily.',
      link: '#',
      linkText: 'See Integration'
    },
    {
      icon: '🛡️',
      title: 'Run Secure and Isolated Desktops',
      description: 'Run a second secure desktop with different privacy settings, snapshots for roll-back and recovery.',
      link: '#',
      linkText: 'View Security Details'
    }
  ];

  currentSlide = 0;
  private sliderInterval?: ReturnType<typeof setInterval>;

  @ViewChildren('animatedSection', { read: ElementRef }) animatedSections!: QueryList<ElementRef>;
  private observer?: IntersectionObserver;
  private sectionsSubscription?: Subscription;
  constructor(private modalService: NgbModal) {

  }
  ngOnInit(): void {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.categoriesLoading = true;
    this.toolsLoading = true;

    const categories$ = this.behaviorSubject.getCategoryNameList();
    const freeTools$ = this.behaviorSubject.getFreeProductsList();
    const paidTools$ = this.behaviorSubject.getPaidProductsList();

    forkJoin({
      categories: categories$,
      freeTools: freeTools$,
      paidTools: paidTools$
    }).subscribe({
      next: (data) => {
        this.categories = data.categories;
        this.freeTools = data.freeTools;
        this.paidTools = data.paidTools;
        this.categoriesLoading = false;
        this.toolsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.categoriesLoading = false;
        this.toolsLoading = false;
      }
    });
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

    // This will likely be empty on first run because of the *ngIfs
    this.animatedSections.forEach(section => {
      this.observer?.observe(section.nativeElement);
    });

    // Subscribe to changes in the QueryList to handle elements that appear later
    this.sectionsSubscription = this.animatedSections.changes.subscribe((sections: QueryList<ElementRef>) => {
      sections.forEach(section => {
        this.observer?.observe(section.nativeElement);
      });
    });
  }
  OpenBuyNowPopUp(id: any, tool: toolDetails): void {
    const modalRef = this.modalService.open(BuyNowComponent, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
    modalRef.componentInstance.nTitleMatterStatusId = id
    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.product = tool;
  }
  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
    this.observer?.disconnect();
    this.sectionsSubscription?.unsubscribe();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
}
