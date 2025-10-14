import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2'
import { AccountService } from '../../services/account/account.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage: string = '';
  loginLoading: boolean = false;
  showPassword: boolean = false;
  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
  ) { }
  // NTitle Standard
  // jone1122@gmail.com 

  // NTitle Admin
  //   scarlet@gmail.com 
  // NTitleadmin@gmail.com
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  showHidePassword() {
    this.showPassword = !this.showPassword;
  }
  // isColorDark(color: string): boolean {
  //   // Convert hex color to RGB
  //   const hex = color.replace('#', '');
  //   const r = parseInt(hex.substr(0, 2), 16);
  //   const g = parseInt(hex.substr(2, 2), 16);
  //   const b = parseInt(hex.substr(4, 2), 16);

  //   // Calculate perceived brightness
  //   const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  //   // Return true if color is dark, false if it's light
  //   return brightness < 128;
  // }
  onSubmitLogin() {
    this.location;
    // this.router.navigateByUrl(`/admin/dashboard`);
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.loginLoading = true;
      this.accountService.login(this.loginForm.value).subscribe(
        (dt) => {
          if (dt.role == 'Admin') {
            this.router.navigateByUrl(`/admin`);
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Login Successfully"
            });
          } else {
            this.router.navigateByUrl(`/`);
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "error",
              title: "You are not authorized to access this page."
            });
          }
          this.loginLoading = false;
        },
        (error) => {
          this.errorMessage = error.error.message;
          this.loginLoading = false;
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: error.error.message
          });
        }
      );
    }
  }
  gotoDashboard() {
    this.router.navigateByUrl(`/admin`);
  }
  goToOtherScreens(screen: any) {
    this.router.navigateByUrl(`/auth/${screen}`);
  }
  goBack() {
    this.location.back();
  }
}
