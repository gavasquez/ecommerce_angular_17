import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-forgot-password',
  standalone: true,
  imports: [ CommonModule ,ReactiveFormsModule ],
  templateUrl: './code-forgot-password.component.html',
  styleUrl: './code-forgot-password.component.css'
})
export class CodeForgotPasswordComponent {

  formCodeForgotPassword: FormGroup;
  isLoadingMail: boolean = false;

  @Output() LoadingCodeStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() codeValue: EventEmitter<string> = new EventEmitter();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ){
    this.formCodeForgotPassword = this.fb.group({
      code: ['', [ Validators.required, Validators.minLength(6) ]],
    });
  }

  verifiedCode(){
    if(this.formCodeForgotPassword.invalid){
      this.toastr.error("Validación", "Por favor validar el codigo ingresado");
      return;
    }
    let data = {
      code: this.formCodeForgotPassword.get('code')?.value,
    }
    this.authService.verifiedCode(data).subscribe((resp: { message: number }) => {
      if( resp.message == 200){
        this.isLoadingMail = true;
        this.LoadingCodeStatus.emit(this.isLoadingMail);
        this.codeValue.emit(this.formCodeForgotPassword.get('code')?.value);
        this.toastr.success("Exito", "El codigo es correcto ahora cambia tu contraseña");
      }else {
        this.isLoadingMail = false;
        this.LoadingCodeStatus.emit(this.isLoadingMail);
        this.toastr.error("Validación", "Codigo no existe");
      }
    });
  }

}
