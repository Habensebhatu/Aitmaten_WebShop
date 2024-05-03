import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserRegistrationService } from 'src/app/service/user-registration.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage?: string;
  unsubscribe$ = new Subject<void>();

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private autService: UserRegistrationService,
      private metaService: Meta
     
  ) { }

  ngOnInit() {
    this.metaService.addTag({ rel: 'canonical', href: 'https://sofanimarket.com/' });
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
  }

  onSubmit() {
    if (this.loginForm.valid) {
        this.autService.login(this.loginForm.value).subscribe(
            response => {
                const decodedToken = this.autService.decodeJWT(response.token);
                console.log("decodedToken",decodedToken)
                this.autService.setCurrentUser(decodedToken);
                localStorage.setItem('token', response.token);
                this.router.navigate(['/home']);
            },
            error => {
                console.error('Login error', error);
                this.errorMessage = 'Incorrect username or password';
            }
        );
    }
}

  
}
