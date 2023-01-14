import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService, ResponsePostsData } from "../common/data-storage.service";
import { PostService } from "./post.service";

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<ResponsePostsData> {
    constructor(
        private dataStorageService: DataStorageService,
        private postService: PostService,
        private authService: AuthService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ResponsePostsData | Observable<ResponsePostsData> | Promise<ResponsePostsData> {
        const posts = this.postService.getPosts();
        if (Object.keys(posts).length === 0) {
            return this.dataStorageService.fetchOwnPosts(this.authService.getUserId());
        } else {
            return posts;
        }
    }
}