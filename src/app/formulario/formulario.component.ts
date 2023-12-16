import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
 
 
  form:FormGroup;

  constructor(private formBuilder:FormBuilder, private userService: UserService) {
    this.buildForm();
    /*this.form.valueChanges.pipe(debounceTime(1000)).subscribe(value => {console.log(value);});*/
  }
  ngOnInit(): void {

  }  

  private buildForm(){
    this.form = this.formBuilder.group({
      nombrecompleto: new FormControl('',[Validators.required, Validators.maxLength(40)]),/**Validators.pattern(/^\d{10}$/) */
      cedula: new FormControl('',[Validators.required,Validators.pattern(/^\d{10}$/),this.validacionIDEcuatoriana]),
      fechanacimiento: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      paisresidencia: new FormControl('',[Validators.required]),
      sexo: new FormControl('',[Validators.required]),
      biografia: new FormControl('',[Validators.required,Validators.maxLength(1000), Validators.minLength(100)]),
      termscondiciones: new FormControl('',[Validators.required]),
      captcha: new FormControl('',[Validators.required, this.ValidarcaptCha])
    });    
  }

  //Validacion de Captcha
  ValidarcaptCha(control: AbstractControl) {
    const veriCaptcha = control.value;
    return veriCaptcha ? null : { invalidocp: true };
  }
  

  //validacion de cedula Ecuatoriana 
  validacionIDEcuatoriana(control: AbstractControl) {
    const cedula = control.value.toString(); // Convertir a cadena
    
    const Ncedula = cedula.length;
    
    if (Ncedula !== 10) {
      return { 'cedulaInvalida': true };
    } else {
      let suma = 0;
      const verif = parseInt(cedula.charAt(9), 10);
    
      for (let i = 0; i < 9; i++) {
        let digito = parseInt(cedula.charAt(i), 10);
    
        if (i % 2 === 0) {
          digito *= 2;
    
          if (digito > 9) {
            digito -= 9;
          }
        }
    
        suma += digito;
      }
      const resultado = 10 - (suma % 10);
      if (resultado === verif || (resultado === 10 && verif === 0)) {
        return null;
      } else {
        return { 'cedulaInvalida': true };
      }
    }
  }
  
  //Metodo Funcional de Guardado en Bases de Datos
 save(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;

      // Enviar los datos al servicio para que los envíe a la API
      this.userService.saveUser(value).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);

          // Verifica la respuesta de texto y muestra mensajes según sea necesario
          if (response.includes('éxito')) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Usuario guardado con éxito en la base de datos',
            });
          } else {
            // Muestra mensajes de error según sea necesario
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al guardar el usuario. Por favor, inténtalo de nuevo.',
            });
          }
        },
        error => {
          console.error('Error al guardar el usuario:', error);

          // Verificar si la respuesta es un error del servidor
          if (error.status === 0 || error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.',
            });
          } else {
            // Otro tipo de error, puedes personalizar el mensaje según sea necesario
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al guardar el usuario. Por favor, inténtalo de nuevo.',
            });
          }
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

}
