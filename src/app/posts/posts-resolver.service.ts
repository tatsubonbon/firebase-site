import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../common/data-storage.service";
import { Post } from "./post.model";
import { PostService } from "./post.service";

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Post[]> {
    constructor(private dataStorageService: DataStorageService, private postService: PostService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Post[] | Observable<Post[]> | Promise<Post[]> {
        const posts = this.postService.getPosts();
        if (posts.length === 0) {
            return this.dataStorageService.fetchPosts();
        } else {
            return posts;
        }
    }
}