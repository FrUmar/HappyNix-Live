import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserCacheService } from '../../services/UserCacheData/userCacheService';
import { AdminCategory } from '../../models/admin';
import { CardLoadingComponent } from "../../reuse/card-loading/card-loading.component";
import { UserService } from '../../services/User/user.service';
import { toolDetails } from '../../models/user';
import { of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { BuyNowComponent } from '../buy-now/buy-now.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tools-list',
  imports: [CommonModule, RouterModule, FormsModule, CardLoadingComponent],
  templateUrl: './tools-list.component.html',
  styleUrl: './tools-list.component.scss'
})
export class ToolsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animatedSection', { read: ElementRef }) animatedSections!: QueryList<ElementRef>;
  private observer?: IntersectionObserver;
  paramName: string = '';
  tools: toolDetails[] = [];
  isLoading = true;
  categoryId: string = '';
  filter: 'all' | 'free' | 'paid' = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  searchQuery: string = '';

  get filteredTools(): toolDetails[] {
    return this.tools.filter(tool => {
      if (this.filter === 'free') return tool.isFree;
      if (this.filter === 'paid') return !tool.isFree;
      return true;
    });
  }

  constructor(
    private route: ActivatedRoute,
    private userCacheService: UserCacheService,
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.paramName = this.route.snapshot.paramMap.get('mainId') || '';
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['Search'] || '';
      this.getSearchTools();

    });
  }

  ngOnInit(): void {
    if (this.paramName) {
      this.getToolsByCategory();
    }

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

    // Observe elements that are present initially
    this.animatedSections.forEach(section => {
      this.observer?.observe(section.nativeElement);
    });

    // Observe elements added later dynamically
    this.animatedSections.changes.subscribe((sections: QueryList<ElementRef>) => {
      sections.forEach(section => this.observer?.observe(section.nativeElement));
    });
  }
  getSearchTools() {

    if (this.searchQuery) {
      this.isLoading = true;
      this.tools = []
      this.userService.searchProducts(this.searchQuery).pipe(
        catchError(err => {
          console.error('Error searching tools:', err);
          return of([]); // Return an empty array on error
        }),
        finalize(() => this.isLoading = false)
      ).subscribe(tools => {
        this.tools.push(...tools);
      });
    }
  }
  getToolsByCategory() {
    if (this.paramName) {
      this.isLoading = true;
      this.tools = []

      this.userCacheService.getCategoryNameList().pipe(
        switchMap(categories => {
          const category = categories.find(c => c.name.toLowerCase() === this.paramName.toLowerCase());
          if (category) {
            this.categoryId = category.categoryId;
            return this.userService.getProductsByCategory(this.categoryId);
          } else {
            console.error(`Category '${this.paramName}' not found.`);
            return of([]); // Return an empty array if category is not found
          }
        }),
        catchError(err => {
          console.error('Error fetching tools:', err);
          return of([]); // Return an empty array on error
        }),
        finalize(() => this.isLoading = false)
      ).subscribe(tools => {
        this.tools.push(...tools);
      });
    }
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
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
  placeOrder(product: any): void {

    const expiration = new Date(localStorage.getItem('exploits_expiration') ?? '');
    if (
      !localStorage.getItem('exploits_access_token') ||
      !localStorage.getItem('exploits_userId') ||
      expiration < new Date()
    ) {
      this.router.navigateByUrl(`/auth/login`);
      return;
    }
    const payload: any = {
      amount: 0,
      productName: product.name,
      paymentMethod: 'Download',
      savedCardId: null, // Not available from form
      cryptoWalletAddress: null // Not available from form
    };

    this.userService.createOrder(payload).subscribe({
      next: (response) => {

      },
      error: (err) => {
        console.error('Order placement failed:', err);
      }
    });
  }
}