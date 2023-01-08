import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../common/data-storage.service';
import { LoadingSpinnerService } from '../common/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthentificated = false;
  private userSub: Subscription = new Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private loadingService: LoadingSpinnerService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthentificated = !user?.id ? false : true;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  Onlogout() {
    this.authService.logout();
  }
}
