import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "src/environments/environment.prod";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
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

    editPosts(postDict: { [key: string]: Post }) {
        const key: string = Object.keys(postDict)[0];
        const url = [environment.apiUrl, 'posts', key + '.json'];
        return this.http.put(url.join("/"), postDict[key])
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

    fetchOwnPosts(uid: string) {
        const url = [environment.apiUrl, 'posts.json']
        return this.http.get<{ [key: string]: Post }>(url.join('/') + '?orderBy="uid"&equalTo=' + JSON.stringify(uid))
            .pipe(
                catchError(this.handleError),
                tap(posts => {
                    this.postService.setPosts(posts);
                }))
    }

    fetchPosts() {
        const url = [environment.apiUrl, 'posts.json']
        return this.http.get<{ [key: string]: Post }>(url.join('/'))
            .pipe(
                catchError(this.handleError))
    }

    storeUser(user: User) {
        const url = [environment.apiUrl, 'users', user.id, '.json']
        return this.http.put(url.join("/"), user)
            .pipe(
                catchError(this.handleError)
            );
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