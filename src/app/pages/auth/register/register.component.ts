import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare function password_show_toggle():any;
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ){
    setTimeout(() => {
      password_show_toggle();
    }, 50);
  }

  register(){
    if(!this.name || !this.surname || !this.email || !this.password || !this.phone){
      this.toast.error("Validacion", "Necesitas ingresar todos los campos");
      return
    }
    let data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      phone: this.phone,
    }
    this.authService.register(data).subscribe((resp: any) => {
        this.toast.success("Exito", "Ingresa tu correo para completar tu registro");
        setTimeout(() => {
          this.router.navigateByUrl("/login");
        }, 500);
    });
  }

}
