import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatrixRainComponent } from '../../users/matrix-rain/matrix-rain.component';
import { AccountService } from '../../services/account/account.service';
import Swal from 'sweetalert2';

// Custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    // return if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatrixRainComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage: string = '';
  registerLoading: boolean = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  showHidePassword(): void {
    this.showPassword = !this.showPassword;
  }

  showHideConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.registerLoading = true;
    // Exclude confirmPassword from the data sent to the server
    const { confirmPassword, ...userData } = this.registerForm.value;

    this.accountService.signUpUser(userData).subscribe({
      next: () => {
        this.registerLoading = false;
        const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true });
        Toast.fire({ icon: "success", title: "Registration Successful!" });
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.registerLoading = false;
        this.errorMessage = error.error.message || error.error.description;
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          title: this.errorMessage
        });
      }
    });
  }
}
