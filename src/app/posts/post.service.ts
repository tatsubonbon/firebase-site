import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Post } from "./post.model";


@Injectable({ providedIn: 'root' })
export class PostService {
    PostSelected = new Subject<Post>();
    postsChanged = new Subject<Post[]>();

    constructor() {

    }

    // private Posts: Post[] = [
    //     new Post('Test Post', 'this is a test', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg', [new Ingredient('Meet', 1), new Ingredient('French', 20)]),
    //     new Post('Another Test Post', 'this is a test', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg', [])
    // ];

    private posts: Post[] = []

    setPosts(posts: Post[]) {
        this.posts = posts;
        this.postsChanged.next(this.posts);
    }

    getPosts() {
        return this.posts.slice();
    }

    getPost(index: number) {
        return this.posts[index];
    }

    addPost(post: Post) {
        this.posts.push(post);
        this.postsChanged.next(this.posts.slice());
    }

    updatePost(index: number, newPost: Post) {
        this.posts[index] = newPost;
        this.postsChanged.next(this.posts.slice());
    }

    deletePost(index: number) {
        this.posts.splice(index, 1);
        this.postsChanged.next(this.posts.slice());
    }
}