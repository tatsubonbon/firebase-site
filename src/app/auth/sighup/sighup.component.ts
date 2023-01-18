import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AlertService } from 'src/app/common/alert/alert.service';
import { DataStorageService } from 'src/app/common/data-storage.service';
import { LoadingSpinnerService } from 'src/app/common/loading-spinner/loading-spinner.service';
import { AuthReponseData, AuthService } from '../auth.service';
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

  selectedFile: File | undefined;

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    const accountName = form.value.accountName;

    let authObs: Observable<AuthReponseData>;

    this.loadingSpinnerService.show()
    authObs = this.authService.signUp(email, password);

    if (this.selectedFile) {
      // 画像が選択されている場合
      authObs.subscribe(response => {
        const userId = response.localId;
        const filePath = ['users', this.authService.getUserId(), Date.now()].join('/');
        this.dataStorageService.storeFile(this.selectedFile!, filePath)
          .subscribe(
            storageRes => {
              if (storageRes?.state == 'success') {
                this.dataStorageService.getFile(storageRes.metadata.fullPath).subscribe(
                  path => {
                    const user = {
                      id: userId,
                      email: email,
                      name: name,
                      accountName: accountName,
                      imageUrl: path,
                      followCount: 0,
                      followerCount: 0
                    }
                    this.dataStorageService.storeUser(user).subscribe(res => {
                      this.alertService.hideError();
                      this.loadingSpinnerService.hide();
                      this.router.navigate(['/posts']);
                    }, error => {
                      this.alertService.showError(error.errorMessage);
                      this.loadingSpinnerService.hide();
                    })
                  }
                )
              }
            }
          )
      }, error => {
        this.alertService.showError(error.errorMessage);
        this.loadingSpinnerService.hide();
      });
    } else {
      // 画像が選択されていない場合
      authObs.pipe(
        mergeMap(res => {
          const user = {
            id: res.localId,
            email: email,
            name: name,
            accountName: accountName,
            imageUrl: '',
            followCount: 0,
            followerCount: 0
          }
          return this.dataStorageService.storeUser(user)
        })
      ).subscribe(res => {
        this.alertService.hideError();
        this.loadingSpinnerService.hide();
        this.router.navigate(['/posts']);
      }, error => {
        this.alertService.showError(error.errorMessage);
        this.loadingSpinnerService.hide();
      })
    };
    form.reset();
  }

  changeFile(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
