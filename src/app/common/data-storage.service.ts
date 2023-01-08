import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "src/environments/environment.prod";
import { AuthService } from "../auth/auth.service";
import { Post } from "../posts/post.model";
import { PostService } from "../posts/post.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private postService: PostService, private authService: AuthService) {
    }

    storePosts() {
        const posts = this.postService.getPosts();
        return this.http.put(environment.apiUrl + '/posts.json', posts)
            .pipe(
                catchError(this.handleError)
            );;
    }

    fetchPosts() {
        return this.http.get<Post[]>(environment.apiUrl + '/posts.json')
            .pipe(
                catchError(this.handleError),
                tap(posts => {
                    this.postService.setPosts(posts);
                }))
    }

    private handleError(errorRes: HttpErrorResponse) {
        console.log(errorRes);
        let errorMessage = 'An unknown error occured';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(() => new Error(errorMessage))
        }
        errorMessage = errorRes.error.error;
        return throwError(() => new Error(errorMessage))
    }
}