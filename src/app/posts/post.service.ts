import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Post } from "./post.model";


@Injectable({ providedIn: 'root' })
export class PostService {
    PostSelected = new Subject<Post>();
    postsChanged = new Subject<{ [key: string]: Post }>();

    constructor() {

    }

    private posts: { [key: string]: Post } = {}

    setPosts(posts: { [key: string]: Post }) {
        this.posts = posts;
        this.postsChanged.next(posts);
    }

    getPosts() {
        const postList: Post[] = []
        Object.keys(this.posts).forEach((key: string) => {
            postList.push(this.posts[key]);
        })
        return this.posts;
    }

    getPost(key: string) {
        return this.posts[key];
    }

    addPost(post: { [key: string]: Post }) {
        Object.keys(post).forEach((key: string) => {
            this.posts[key] = post[key];
        })
        this.postsChanged.next(this.posts);
    }

    updatePost(key: string, newPost: Post) {
        this.posts[key] = newPost;
        this.postsChanged.next(this.posts);
    }

    deletePost(key: string) {
        delete this.posts[key];
        this.postsChanged.next(this.posts);
    }
}