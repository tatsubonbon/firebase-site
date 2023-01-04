import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  posts: Post[] = [];
  subscription: Subscription = new Subscription;

  constructor(
    private postService: PostService,
    private loadingService: LoadingSpinnerService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.postService.postsChanged.subscribe(
      (posts: Post[]) => {
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
    console.log("fetch");
    this.loadingService.show();
    this.dataStorageService.fetchPosts().subscribe(response => {
      this.loadingService.hide();
    });
  }
}