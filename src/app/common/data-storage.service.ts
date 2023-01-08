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

    storePosts(post: Post) {
        const url = [environment.apiUrl, 'posts.json']
        return this.http.post(url.join("/"), post)
            .pipe(
                catchError(this.handleError)
            );
    }

    editPosts(post: { [key: string]: Post }) {
        const key: string = Object.keys(post)[0];
        const url = [environment.apiUrl, 'posts', key + '.json'];
        return this.http.put(url.join("/"), post[key])
            .pipe(
                catchError(this.handleError)
            );
    }

    deletePosts(key: string) {
        const url = [environment.apiUrl, 'posts', key + '.json'];
        return this.http.delete(url.join("/"))
            .pipe(
                catchError(this.handleError)
            );
    }

    fetchPosts() {
        const url = [environment.apiUrl, 'posts.json']
        return this.http.get<{ [key: string]: Post }>(url.join('/'))
            .pipe(
                catchError(this.handleError),
                tap(posts => {
                    this.postService.setPosts(posts);
                }))
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(() => new Error(errorMessage))
        }
        errorMessage = errorRes.error.error;
        return throwError(() => new Error(errorMessage))
    }
}