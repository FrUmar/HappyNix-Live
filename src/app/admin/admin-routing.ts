import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { MyToolsComponent } from './my-tools/my-tools.component';
import { CetagorysComponent } from './cetagorys/cetagorys.component';
import { adminAuthGuard } from '../services/Auth-Guard/auth-guard.guard';
import { ClientsComponent } from './clients/clients.component';
import { TutorialsComponent } from './tutorials/tutorials.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [adminAuthGuard],
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
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'tutorials',
        component: TutorialsComponent,
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouting { }
