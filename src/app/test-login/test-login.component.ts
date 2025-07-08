import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-test-login',
    imports: [ButtonModule],
    templateUrl: './test-login.component.html',
    styleUrl: './test-login.component.css'
})
export class TestLoginComponent implements OnInit {
    constructor(
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
    }

    login() {
        this.authService.login()

    }
}
