import { Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
    },
    { path: 'auth', loadChildren: () => import('./auth/auth-routing').then((m) => m.AuthRouting) },
    { path: 'admin', loadChildren: () => import('./admin/admin-routing').then(m => m.AdminRouting) },
    { path: '', loadChildren: () => import('./users/users-routing').then((m) => m.UsersRouting) },

    { path: '**', component: NotFoundComponent },
];
