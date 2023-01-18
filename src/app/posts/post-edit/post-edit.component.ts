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
  selectedFile: File | undefined;
  postForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    imagePath: new UntypedFormControl(),
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
    if (this.editMode) {
      this.editPost();
    } else {
      this.storePost();
    }
  }

  storePost() {
    this.loadingService.show();
    const filePath = ['posts', this.authService.getUserId(), Date.now()].join('/');
    this.dataStorageService.storeFile(this.selectedFile!, filePath).subscribe(
      storageRes => {
        if (storageRes?.state == 'success') {
          this.dataStorageService.getFile(storageRes.metadata.fullPath).subscribe(
            path => {
              const post = new Post(
                this.postForm?.value['name'],
                this.postForm?.value['description'],
                path,
                this.authService.getUserId()
              );
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
          )
        }
      }
    )
    this.onCancel();
  }

  editPost() {
    this.loadingService.show();
    if (this.selectedFile) {
      // ファイルを選択している場合
      this.dataStorageService.deleteFile(this.postService.getPost(this.id!).imagePath).subscribe();
      const filePath = ['posts', this.authService.getUserId(), Date.now()].join('/');
      this.dataStorageService.storeFile(this.selectedFile!, filePath).subscribe(
        storageRes => {
          if (storageRes?.state == 'success') {
            this.dataStorageService.getFile(storageRes.metadata.fullPath).subscribe(
              path => {
                const post = new Post(
                  this.postForm?.value['name'],
                  this.postForm?.value['description'],
                  path,
                  this.authService.getUserId()
                );
                this.dataStorageService.editPosts({ [this.id!]: post }).subscribe(
                  response => {
                    this.postService.updatePost(this.id!, post);
                    this.alertService.hideError();
                    this.loadingService.hide();
                  }, error => {
                    this.alertService.showError(error.message);
                    this.loadingService.hide();
                  });
              }
            )
          }
        }
      )
    } else {
      // ファイルを選択していない場合
      const imagePath = this.postService.getPost(this.id!).imagePath;
      const post = new Post(
        this.postForm?.value['name'],
        this.postForm?.value['description'],
        imagePath,
        this.authService.getUserId()
      );
      this.dataStorageService.editPosts({ [this.id!]: post }).subscribe(
        response => {
          this.postService.updatePost(this.id!, post);
          this.alertService.hideError();
          this.loadingService.hide();
        }, error => {
          this.alertService.showError(error.message);
          this.loadingService.hide();
        });
    }
    this.onCancel();
  }

  changeFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onCancel() {
    this.router.navigate(['posts']), { relativeTo: this.route };
  }

  private initForm() {
    let name = '';
    let description = '';

    if (this.editMode) {
      const post: Post = this.postService.getPost(this.id!);
      name = post?.name;
      description = post?.description;
    }

    if (this.editMode) {
      this.postForm = new UntypedFormGroup({
        'name': new UntypedFormControl(name, Validators.required),
        'imagePath': new UntypedFormControl(''),
        'description': new UntypedFormControl(description),
      });
    } else {
      this.postForm = new UntypedFormGroup({
        'name': new UntypedFormControl(name, Validators.required),
        'imagePath': new UntypedFormControl('', Validators.required),
        'description': new UntypedFormControl(description),
      });
    }
  }
}
