import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { SafePipe } from "../tutorials/safe.pipe";
import { AdminService } from '../../services/Admin/admin.service';
import { AdminProduct } from '../../models/admin';
import { toolDetails } from '../../models/user';
import { BuyNowComponent } from '../buy-now/buy-now.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/User/user.service';



@Component({
  selector: 'app-tool-details',
  standalone: true,
  imports: [CommonModule, RouterModule, SafePipe],
  templateUrl: './tool-details.component.html',
  styleUrls: ['./tool-details.component.scss']
})
export class ToolDetailsComponent implements OnInit, OnDestroy {
  tool: AdminProduct | undefined;
  toolId: string | null = null;
  private routeSub: Subscription | undefined;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private adminService: AdminService,
    private modalService: NgbModal,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      this.toolId = params.get('toolId');
      if (this.toolId) {

        this.adminService.getProductDetails(this.toolId).subscribe({
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
  OpenBuyNowPopUp(tool: toolDetails): void {
    const modalRef = this.modalService.open(BuyNowComponent, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
    modalRef.componentInstance.nTitleMatterStatusId = this.toolId
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