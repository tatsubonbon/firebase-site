import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Post } from "./post.model";


@Injectable({ providedIn: 'root' })
export class PostService {
    PostSelected = new Subject<Post>();
    postsChanged = new Subject<{ [key: string]: Post }>();

    constructor() {

    }

    private postsDict: { [key: string]: Post } = {}

    setPosts(postsDict: { [key: string]: Post }) {
        this.postsDict = postsDict;
        this.postsChanged.next(postsDict);
    }

    getPosts() {
        const postList: Post[] = []
        Object.keys(this.postsDict).forEach((key: string) => {
            postList.push(this.postsDict[key]);
        })
        return this.postsDict;
    }

    getPost(key: string) {
        return this.postsDict[key];
    }

    addPost(postsDict: { [key: string]: Post }) {
        Object.keys(postsDict).forEach((key: string) => {
            this.postsDict[key] = postsDict[key];
        })
        this.postsChanged.next(this.postsDict);
    }

    updatePost(key: string, newPost: Post) {
        this.postsDict[key] = newPost;
        this.postsChanged.next(this.postsDict);
    }

    deletePost(key: string) {
        delete this.postsDict[key];
        this.postsChanged.next(this.postsDict);
    }
}