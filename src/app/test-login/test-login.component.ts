import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-test-login',
    imports: [CommonModule, ButtonModule],
    templateUrl: './test-login.component.html',
    styleUrl: './test-login.component.css'
})
export class TestLoginComponent implements OnInit {

    authenticated: boolean = false;

    constructor(
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
        this.authService.isAuthenticated$
            .pipe(distinctUntilChanged())
            .subscribe(authenticated => {
                console.log('authenticated', authenticated)
                this.authenticated = authenticated
            });
    }

    login() {
        this.authService.login()
    }
    logout() {
        this.authService.logout()
    }
}
