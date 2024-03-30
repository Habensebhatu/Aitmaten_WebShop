import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserRegistration } from 'src/app/Models/ UserRegistration';
import { UserRegistrationService } from 'src/app/service/user-registration.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private userRegistrationService: UserRegistrationService, private router: Router,) {
    this.registerForm = this.fb.group({
      bedrijfsNaam: ['', Validators.required],
      kvkNummer: ['', Validators.required],
      btw: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      address: this.fb.group({
        street: ['', Validators.required],
        residence: ['', Validators.required],
        zipCode: ['', Validators.required],
        phoneNumber: ['', Validators.required],
      })
    });
  }

  ngOnInit(): void {
  }

  matchPassword(group: FormGroup) {
    const password = group.get('password')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;
    if (password === confirmPassword) {
      return null;
    } else {
      group.get('confirmPassword')!.setErrors({ mismatch: true });
      return { mismatch: true };
    }
  }

  onSubmit(): void {
    const ValidationErrors = this.matchPassword(this.registerForm);
    console.log("user", this.registerForm.value)
    const user = new UserRegistration(this.registerForm.value);
    console.log("user", user)
    this.userRegistrationService.AddUser(user).pipe(takeUntil(this.unsubscribe$))
      .subscribe((success: any) => {
        if (success) {
          alert('Registratie gelukt');
          const decodedToken = this.userRegistrationService.decodeJWT(success.token);
          console.log("decodedToken",decodedToken)
          this.userRegistrationService.setCurrentUser(decodedToken);
          localStorage.setItem('token', success.token);
          this.router.navigate(['/home']);
          this.registerForm.reset();
          return null;
        } else {
          this.registerForm.get('email')!.setErrors({ misUserName: true });
          return { misUserName: true };
        }

      });;
  }

}
