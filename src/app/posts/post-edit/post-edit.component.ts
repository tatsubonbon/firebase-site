import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  id: number | undefined;
  editMode = false;
  postForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    imagePath: new UntypedFormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private dataStorageService: DataStorageService,
    private loadingService: LoadingSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }


  onSubmit() {
    const newRecipe = new Post(
      this.postForm?.value['name'],
      this.postForm?.value['description'],
      this.postForm?.value['imagePath']
    );
    if (this.editMode) {
      this.postService.updatePost(this.id!, this.postForm?.value);
      this.save();
    } else {
      this.postService.addPost(this.postForm?.value);
      this.save();
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['posts']), { relativeTo: this.route };
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

  private initForm() {
    let name = '';
    let imagePath = '';
    let description = '';

    if (this.editMode) {
      const post: Post = this.postService.getPost(this.id!);
      name = post.name;
      imagePath = post.imagePath;
      description = post.description;
    }

    this.postForm = new UntypedFormGroup({
      'name': new UntypedFormControl(name, Validators.required),
      'imagePath': new UntypedFormControl(imagePath, Validators.required),
      'description': new UntypedFormControl(description),
    });
  }
}
