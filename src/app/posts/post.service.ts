import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ResponsePostsData } from "../common/data-storage.service";

import { Post } from "./post.model";


@Injectable({ providedIn: 'root' })
export class PostService {
    PostSelected = new Subject<Post>();
    postsChanged = new Subject<ResponsePostsData>();
    private postsDict: ResponsePostsData = {}

    constructor() { }

    setPosts(postsDict: ResponsePostsData) {
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

    addPost(postsDict: ResponsePostsData) {
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