import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AlertService } from '../common/alert/alert.service';
import { DataStorageService, ResponsePostsData } from '../common/data-storage.service';
import { LoadingSpinnerService } from '../common/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthentificated = false;
  private userSub: Subscription = new Subscription;
  postsDict: ResponsePostsData = {};

  constructor(
    private authService: AuthService,
    private dataStorageService: DataStorageService,
    private alertService: AlertService,
    private loadingService: LoadingSpinnerService,
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthentificated = !user?.id ? false : true;
    });
    this.onFetchData();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onFetchData() {
    this.loadingService.show();
    this.dataStorageService.fetchPosts().subscribe(
      response => {
        this.postsDict = response;
        this.alertService.hideError();
        this.loadingService.hide();
      }, error => {
        this.alertService.showError(error.message);
        this.loadingService.hide();
      })
  }
}
