import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { NameValidator } from '../../core/validators/name.validator';
import { ToastrService } from 'ngx-toastr';
import { error, log } from 'console';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  panel:string = 'login';

  //for login
  SubmitForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required,NameValidator.noExtraSpaces]),
    confirmPassword: new FormControl('',[Validators.required])
  });

  //for registration
  NewForm: FormGroup = new FormGroup({
    username: new FormControl('',[Validators.required,NameValidator.noExtraSpaces]),
    email: new FormControl('', [Validators.required,NameValidator.noExtraSpaces]),
    password: new FormControl('',[Validators.required]),
    confirmPassword: new FormControl('',[Validators.required]),
  },{validators: this.customPasswordMatching.bind(this) });

  response:any;
  passwordMismatch: ValidatorFn | ValidatorFn[] | null | undefined;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ){}

  customPasswordMatching(NewForm:AbstractControl): { [key: string]: boolean } | null  {
    const password = NewForm.get('password')?.value;
    const confirmPassword = NewForm.get('confirmPassword')?.value;
    // return password === confirmPassword ? null : { passwordMismatch: true };
    return password === confirmPassword ? null : { passwordMismatchError: true };
  }

  switchType(event:string){
    this.panel = event;
  }

  resetForm(): void {
    this.SubmitForm.reset();
  }
  
  onSubmitLogin = async () => {
    try{
      if (this.SubmitForm.valid ) {
  
      const loginData = {
        email: this.SubmitForm.value.email, // Replace this with the actual form control names
        password: this.SubmitForm.value.confirmPassword 
      };
  
      const resp = await this.authService.login(loginData.email,loginData.password).toPromise();
      console.log(resp, "Resp");
      if(resp && resp.token){
        this.authService.setToken(resp.token);
        console.log(this.authService.getToken(), "Token");
      }
    } else{
      this.toastr.error('Form is invalid');
    }
    } catch(err){
      console.log(err);
    }
  }
 
  // TODO SignUp - username,email, password, confirmPassword
  onSubmitNew = async () =>{
    try{
      console.log(this.NewForm.value,'----------------'); 

      if (this.NewForm.valid) {

        const signInData = {
          username: this.NewForm.value.username,
          email: this.NewForm.value.email,
          password: this.NewForm.value.password
        }
        console.log(this.NewForm.value,'----------------'); 
        
        const resp = await this.authService.register(signInData.username,signInData.email,signInData.password).toPromise();
        console.log("resp",resp);
        
        if (resp && resp.token) {
          this.authService.setToken(resp.token);
          console.log("Token", this.authService.getToken());
          
        }else{
          this.toastr.error("Form is invalid")
        }
      }
    }catch(err){
      console.log(err);
    }
  }
}


  
}
