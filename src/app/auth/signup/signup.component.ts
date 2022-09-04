import { Component, EventEmitter, Output, OnInit, NgModule} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  templateUrl:'./signup.component.html',
  styleUrls:['./signup.component.css']
})

export class SignupComponent {
constructor(public authService: AuthService) {

}
OnSignup(form: NgForm) {
  if (form.invalid){
    return;
  }
  this.authService.createUser(form.value.email, form.value.password);
}

}
