import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formulario: FormGroup;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router,
    private fb: FormBuilder,
  ){
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    if(this.authService.token && this.authService.user){
      setTimeout(() => {
        this.router.navigateByUrl("/");
      }, 500);
      return;
    }
  }

  login() {
    if(this.formulario.invalid){
      this.toastr.error("Validación", "Por favor validar los datos ingresad");
      return;
    }
    /* if(!this.email || !this.password) {
      this.toastr.error("Validación", "Necesitas ingresar todos los campos");
      return;
    } */
   const email = this.formulario.get('email')?.value;
   const password = this.formulario.get('password')?.value;

    this.authService.login(email, password)
      .subscribe((resp: any) => {
        if(resp.error && resp.error.error){
          this.toastr.error("Validación", "Las credenciales son incorrectas");
          return;
        }
        if(resp){
          this.toastr.success("Exito", "Bienvenido a la tienda");
          setTimeout(() => {
            this.router.navigateByUrl("/");
          }, 500);
        }
      }, (error) => console.log(error));
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

}
