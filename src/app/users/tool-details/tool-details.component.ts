import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { SafePipe } from "../tutorials/safe.pipe";
import { AdminService } from '../../services/Admin/admin.service';
import { AdminProduct } from '../../models/admin';



@Component({
  selector: 'app-tool-details',
  standalone: true,
  imports: [CommonModule, RouterModule, SafePipe],
  templateUrl: './tool-details.component.html',
  styleUrls: ['./tool-details.component.scss']
})
export class ToolDetailsComponent implements OnInit, OnDestroy {
  tool: AdminProduct | undefined;
  private routeSub: Subscription | undefined;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      const id = params.get('toolId');
      if (id) {

        this.adminService.getProductDetails(id).subscribe({
          next: (data) => {
            this.tool = data;
            if (typeof this.tool.features === 'string') {
              this.tool.features = (this.tool.features as string).split(',')
                .map(f => f.trim())
                .filter(f => f);
            }
          },
          error: (err) => console.error('Error fetching tool:', err)
        })
        if (!this.tool) {
          console.error('Tool not found!');
          // this.router.navigate(['/dashboard']);
        }
      } else {
        console.error('No toolId provided in query params!');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }
}