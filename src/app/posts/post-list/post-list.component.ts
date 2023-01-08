import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  postsDict: { [key: string]: Post } = {};
  subscription: Subscription = new Subscription;

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.postService.postsChanged.subscribe(
      (postsDict) => {
        this.postsDict = postsDict;
      }
    )
    this.postsDict = this.postService.getPosts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
