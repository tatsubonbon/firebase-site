import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../common/data-storage.service";
import { Post } from "./post.model";
import { PostService } from "./post.service";

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<{ [key: string]: Post }> {
    constructor(
        private dataStorageService: DataStorageService,
        private postService: PostService,
        private authService: AuthService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { [key: string]: Post } | Observable<{ [key: string]: Post }> | Promise<{ [key: string]: Post }> {
        const posts = this.postService.getPosts();
        if (Object.keys(posts).length === 0) {
            return this.dataStorageService.fetchOwnPosts(this.authService.getUserId());
        } else {
            return posts;
        }
    }
}