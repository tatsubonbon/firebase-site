import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../common/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthentificated = false;
  private userSub: Subscription = new Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      console.log("******");
      console.log(user);
      this.isAuthentificated = !user.id ? false : true;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSave() {
    this.dataStorageService.storePosts();
  }

  onFetchData() {
    this.dataStorageService.fetchPosts().subscribe();
  }

  Onlogout() {
    this.authService.logout();
  }
}
