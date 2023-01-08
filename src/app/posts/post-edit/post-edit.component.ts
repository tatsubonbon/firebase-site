import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertService } from 'src/app/common/alert/alert.service';
import { DataStorageService } from 'src/app/common/data-storage.service';
import { LoadingSpinnerService } from 'src/app/common/loading-spinner/loading-spinner.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  id: string | undefined;
  editMode = false;
  error = '';
  postForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    imagePath: new UntypedFormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alertService: AlertService,
    private authService: AuthService,
    private dataStorageService: DataStorageService,
    private loadingService: LoadingSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }


  onSubmit() {
    const post = new Post(
      this.postForm?.value['name'],
      this.postForm?.value['description'],
      this.postForm?.value['imagePath'],
      this.authService.getUserId()
    );

    this.loadingService.show();
    if (this.editMode) {
      this.dataStorageService.editPosts({ [this.id!]: post }).subscribe(
        response => {
          this.postService.updatePost(this.id!, post);
          this.alertService.hideError();
          this.loadingService.hide();
        }, error => {
          this.alertService.showError(error.message);
          this.loadingService.hide();
        });
    } else {
      this.dataStorageService.storePosts(post).subscribe(
        response => {
          const res = <{ [name: string]: string }>response;
          this.postService.addPost({ [res["name"]]: post });
          this.alertService.hideError();
          this.loadingService.hide();
        }, error => {
          this.alertService.showError(error.message);
          this.loadingService.hide();
        });
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['posts']), { relativeTo: this.route };
  }


  private initForm() {
    let name = '';
    let imagePath = '';
    let description = '';

    if (this.editMode) {
      const post: Post = this.postService.getPost(this.id!);
      name = post?.name;
      imagePath = post?.imagePath;
      description = post?.description;
    }

    this.postForm = new UntypedFormGroup({
      'name': new UntypedFormControl(name, Validators.required),
      'imagePath': new UntypedFormControl(imagePath, Validators.required),
      'description': new UntypedFormControl(description),
    });
  }
}
