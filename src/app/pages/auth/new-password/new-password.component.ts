import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {

  formNewPassword: FormGroup;
  isLoadingMail: boolean = false;

  @Input() code: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
  ){
    this.formNewPassword = this.fb.group({
      new_password: ['', [ Validators.required, Validators.minLength(6) ]],
    });
  }

  verifiedNewPassword(){
    if(this.formNewPassword.invalid){
      this.toastr.error("Validación", "Por favor validar la contraseña ingresada");
      return;
    }
    let data = {
      code: this.code,
      new_password: this.formNewPassword.get('new_password')?.value,
    }
    this.authService.verifiedNewPassword(data).subscribe((resp: { message: number }) => {
      if( resp.message == 200){
        this.toastr.success("Exito", "La contraseña se ha actualizado correctamente");
        this.router.navigateByUrl("/login");
      } else {
        this.toastr.error("Validación", "No se logro actualizar la contraseña");
        this.router.navigateByUrl("/cambiar-credenciales");
      }
    });
  }
}
