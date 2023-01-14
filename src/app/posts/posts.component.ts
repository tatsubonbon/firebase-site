import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AlertService } from '../common/alert/alert.service';
import { DataStorageService, ResponsePostsData } from '../common/data-storage.service';
import { LoadingSpinnerService } from '../common/loading-spinner/loading-spinner.service';
import { PostService } from './post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  postsDict: ResponsePostsData = {};
  subscription: Subscription = new Subscription;
  error = '';

  constructor(
    private postService: PostService,
    private loadingService: LoadingSpinnerService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.postService.postsChanged.subscribe(
      (postsDict: ResponsePostsData) => {
        this.postsDict = postsDict;
      }
    )
    this.postsDict = this.postService.getPosts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNewPost() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onFetchData() {
    this.loadingService.show();
    this.dataStorageService.fetchOwnPosts(this.authService.getUserId()).subscribe(
      response => {
        this.alertService.hideError();
        this.loadingService.hide();
      }, error => {
        this.alertService.showError(error.message);
        this.loadingService.hide();
      })
  }
}