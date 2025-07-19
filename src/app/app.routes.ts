import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { Httpstatus404Component } from './httpstatus404/httpstatus404.component';
import { TestProtectedComponent } from './test-protected/test-protected.component';
import { AuthGuard } from './auth/auth-guard.service';
import { TestLoginComponent } from './test-login/test-login.component';
import { MetarComponent } from './metar/metar.component';

export const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },

    // { path: 'test-login', component: TestLoginComponent },

    // { path: 'test-protected', component: TestProtectedComponent, canActivate: [AuthGuard] },

    { path: 'metar', component: MetarComponent, canActivate: [AuthGuard] },

    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', component: Httpstatus404Component },
];
