import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from '../common/alert/alert.service';
import { LoadingSpinnerService } from '../common/loading-spinner/loading-spinner.service';
import { AuthReponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private closeSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router,
    private loadingSpinnerService: LoadingSpinnerService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthReponseData>;

    this.loadingSpinnerService.show()
    authObs = this.authService.login(email, password);

    authObs.subscribe(response => {
      this.alertService.hideError();
      this.loadingSpinnerService.hide();
      this.router.navigate(['/posts']);
    }, errorMessage => {
      this.alertService.showError(errorMessage);
      this.loadingSpinnerService.hide();
    });
    form.reset();
  }
}
