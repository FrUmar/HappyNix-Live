import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolDetailsComponent } from './tool-details/tool-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TutorialsComponent } from './tutorials/tutorials.component';
import { AboutComponent } from './about/about.component';
import { ToolsListComponent } from './tools-list/tools-list.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
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
        path: 'details',
        component: ToolDetailsComponent,
      },
      {
        path: 'profile',
        component: UserProfileComponent,
      },
      {
        path: 'tutorials',
        component: TutorialsComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'tools/:mainId',
        component: ToolsListComponent,
      },
      {
        path: 'tools',
        component: ToolsListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRouting { }
