import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/common/data-storage.service';
import { LoadingSpinnerService } from 'src/app/common/loading-spinner/loading-spinner.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  id: number | undefined;

  constructor(
    private postService: PostService,
    private loadingService: LoadingSpinnerService,
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.post = this.postService.getPost(this.id);
      }
    );
  }

  onEditPost() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeletePost() {
    this.postService.deletePost(this.id!);
    this.save();
    this.router.navigate(['/posts']);
  }

  private save() {
    this.loadingService.show();
    this.dataStorageService.storePosts().subscribe(
      response => {
        this.loadingService.hide();
      }, error => {
        this.loadingService.hide();
      });
  }

}
