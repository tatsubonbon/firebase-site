import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../common/alert/alert.service';
import { DataStorageService } from '../common/data-storage.service';
import { LoadingSpinnerService } from '../common/loading-spinner/loading-spinner.service';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  posts: { [key: string]: Post } = {};
  subscription: Subscription = new Subscription;
  error = '';

  constructor(
    private postService: PostService,
    private loadingService: LoadingSpinnerService,
    private alertService: AlertService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.postService.postsChanged.subscribe(
      (posts: { [key: string]: Post }) => {
        this.posts = posts;
      }
    )
    this.posts = this.postService.getPosts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNewPost() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onFetchData() {
    this.loadingService.show();
    this.dataStorageService.fetchPosts().subscribe(
      response => {
        this.alertService.hideError();
        this.loadingService.hide();
      }, error => {
        this.alertService.showError(error.message);
        this.loadingService.hide();
      });
  }
}