import { Component } from '@angular/core';
import { CodeForgotPasswordComponent } from '../code-forgot-password/code-forgot-password.component';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule, CodeForgotPasswordComponent, NewPasswordComponent,  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  isLoadingMail: boolean = false;
  isLoadingCode: boolean = false;

  formVerifiedEmail: FormGroup;
  codeValid: string = '';

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ){
    this.formVerifiedEmail = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  verifiedMail(){
    if(this.formVerifiedEmail.invalid){
      this.toastr.error("Validación", "Por favor validar el email ingresado");
      return;
    }
    let data = {
      email: this.formVerifiedEmail.get('email')?.value,
    }
    this.authService.verifiedMail(data).subscribe((resp: {message: number}) => {
      if( resp.message == 200){
        this.isLoadingMail = true;
        this.toastr.success("Exito", "El codigo esta en tu correo electronico");
      }else {
        this.isLoadingMail = false;
        this.toastr.error("Validación", "El correo electronico no existe");
      }
    });
  }

  LoadingCode($event: boolean){
    this.isLoadingCode = $event;
  }

  onCodeValid($event: string){
    this.codeValid = $event;
  }

}
