import { afterNextRender, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

declare function password_show_toggle(): any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formulario: FormGroup;
  code_user: string = '';

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router,
    private fb: FormBuilder,
    public activateRoute: ActivatedRoute
  ){
    this.formulario = this.fb.group({
      email: [ localStorage.getItem('email') ?? '' , [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember: [ true ],
    });
  }

  ngOnInit(): void {
    if(this.authService.token && this.authService.user){
      setTimeout(() => {
        this.router.navigateByUrl("/");
      }, 500);
      return;
    }
    this.activateRoute.queryParams.subscribe((resp: any) => {
      this.code_user = resp.code;
    });

    setTimeout(() => {
      password_show_toggle();
    }, 50);

    /* setTimeout(() => {
      password_show_toggle();
    }, 50); */

    if(this.code_user){
      let data = {
        code_user: this.code_user,
      }
      this.authService.verifiedAuth(data).subscribe((resp: any) => {
        if(resp.message == '403') {
          this.toastr.error("Validación", "El codigó no es validó");
        }
        if(resp.message == '200') {
          this.toastr.success("Validación", "El correo a sido verificado, ingresar a la tienda");
          setTimeout(() => {
            this.router.navigateByUrl("/login");
          }, 500);
        }
      });
    }

  }

  login() {
    console.log(this.formulario.get('remember')?.value)
    if(this.formulario.invalid){
      this.toastr.error("Validación", "Por favor validar los datos ingresados");
      return;
    }
    /* if(!this.email || !this.password) {
      this.toastr.error("Validación", "Necesitas ingresar todos los campos");
      return;
    } */
   ( this.formulario.get('remember')?.value ) ? localStorage.setItem('email', this.formulario.get('email')?.value) :  localStorage.removeItem('email');

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

  rememberMe(){
    this.formulario.get("remember")?.setValue(!this.formulario.get("remember")?.value);
  }

}
