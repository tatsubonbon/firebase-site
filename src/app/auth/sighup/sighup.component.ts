import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AlertService } from 'src/app/common/alert/alert.service';
import { DataStorageService } from 'src/app/common/data-storage.service';
import { LoadingSpinnerService } from 'src/app/common/loading-spinner/loading-spinner.service';
import { AuthReponseData, AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-sighup',
  templateUrl: './sighup.component.html',
  styleUrls: ['./sighup.component.css']
})
export class SighupComponent {
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private loadingSpinnerService: LoadingSpinnerService
  ) { }

  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      accountName: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
    }
  );

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    const accountName = form.value.accountName;
    const imageUrl = form.value.imageUrl;
    const user = new User(email, password, name, accountName, imageUrl);

    let authObs: Observable<AuthReponseData>;

    this.loadingSpinnerService.show()
    authObs = this.authService.signUp(email, password);

    authObs.subscribe(response => {
      user.id = response.localId;
      this.dataStorageService.storeUser(user).subscribe(res => {
        this.alertService.hideError();
        this.loadingSpinnerService.hide();
        this.router.navigate(['/posts']);
      }, error => {
        this.alertService.showError(error.errorMessage);
        this.loadingSpinnerService.hide();
      })
    }, error => {
      this.alertService.showError(error.errorMessage);
      this.loadingSpinnerService.hide();
    });

    form.reset();
  }
}
