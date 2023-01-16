import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from "src/environments/environment.prod";
import { AuthService } from "../auth/auth.service";
import { Post } from "../posts/post.model";
import { PostService } from "../posts/post.service";


export interface StoreUserData {
    id: string;
    email: string;
    name: string;
    accountName: string;
    imageUrl: string;
    followCount: number;
    followerCount: number;
}

export interface ResponsePostsData {
    [key: string]: Post
}

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    uploadPercent: Observable<number | undefined> = new Observable();
    downloadURL: Observable<string | undefined> = new Observable();

    constructor(private http: HttpClient,
        private postService: PostService,
        private storage: AngularFireStorage,
        private authService: AuthService) {
    }

    storePosts(post: Post) {
        const url = [environment.apiUrl, 'posts.json']
        return this.http.post(url.join("/"), post)
            .pipe(
                catchError(this.handleError)
            );
    }

    editPosts(postDict: ResponsePostsData) {
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
        return this.http.get<ResponsePostsData>(url.join('/') + '?orderBy="uid"&equalTo=' + JSON.stringify(uid))
            .pipe(
                catchError(this.handleError),
                tap(posts => {
                    this.postService.setPosts(posts);
                }))
    }

    fetchPosts() {
        const url = [environment.apiUrl, 'posts.json']
        return this.http.get<ResponsePostsData>(url.join('/') + '?orderBy="$key"&limitToLast=10')
            .pipe(
                catchError(this.handleError))
    }

    storeUser(user: StoreUserData) {
        const url = [environment.apiUrl, 'users', user.id, '.json']
        return this.http.put(url.join("/"), user)
            .pipe(
                catchError(this.handleError)
            );
    }

    storeFile(file: File) {
        const filePath = ['posts', this.authService.getUserId(), '', Date.now()].join('/');
        const ref = this.storage.ref(filePath);
        const task = ref.put(file);

        this.uploadPercent = task.percentageChanges();
        return task.snapshotChanges().pipe(
            catchError(this.handleError),
            finalize(() => this.downloadURL = ref.getDownloadURL())
        )
    }

    deleteFile(path: string) {
        const ref = this.storage.refFromURL(path);
        const task = ref.delete();

        return task.pipe(
            catchError(this.handleError),
        )
    }

    getFile(path: string) {
        const ref = this.storage.ref(path);
        return ref.getDownloadURL();
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