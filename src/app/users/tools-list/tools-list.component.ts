import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserCacheService } from '../../services/UserCacheData/userCacheService';
import { AdminCategory } from '../../models/admin';
import { CardLoadingComponent } from "../../reuse/card-loading/card-loading.component";
import { UserService } from '../../services/User/user.service';
import { toolDetails } from '../../models/user';
import { of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

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
    private userService: UserService
  ) {
    this.paramName = this.route.snapshot.paramMap.get('toolId') || '';
  }

  ngOnInit(): void {
    this.isLoading = true;
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

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}