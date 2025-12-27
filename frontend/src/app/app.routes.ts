import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { LoginComponent } from './pages/login.component';
import { SignupComponent } from './pages/signup.component';
import { VerifySignupComponent } from './pages/verify-signup.component';
import { VerifyLoginComponent } from './pages/verify-login.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { DashboardComponent } from './pages/dashboard.component';
import { DataPageComponent } from './pages/data-page.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'login/verify', component: VerifyLoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'signup/verify', component: VerifySignupComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'country-latest',
        component: DataPageComponent,
        data: { title: 'Country Wise Latest', endpoint: '/api/country-latest/page' }
      },
      {
        path: 'worldometer',
        component: DataPageComponent,
        data: { title: 'Worldometer Data', endpoint: '/api/worldometer/page', keywordLabel: 'Filter by country' }
      },
      {
        path: 'full-grouped',
        component: DataPageComponent,
        data: { title: 'Full Grouped', endpoint: '/api/full-grouped/page' }
      },
      {
        path: 'day-wise',
        component: DataPageComponent,
        data: { title: 'Day Wise', endpoint: '/api/daywise/page' }
      },
      {
        path: 'usa-county',
        component: DataPageComponent,
        data: { title: 'USA County Wise', endpoint: '/api/usa-county/page' }
      },
      {
        path: 'clean-complete',
        component: DataPageComponent,
        data: { title: 'Clean Complete', endpoint: '/api/clean-complete/page' }
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' }
];
