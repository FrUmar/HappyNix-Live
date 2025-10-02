import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { MyToolsComponent } from './my-tools/my-tools.component';
import { CetagorysComponent } from './cetagorys/cetagorys.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    // canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'my-tools',
        component: MyToolsComponent,
      },
      {
        path: 'category',
        component: CetagorysComponent,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouting { }
