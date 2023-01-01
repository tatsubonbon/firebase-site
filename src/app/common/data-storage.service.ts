import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from 'rxjs/operators';
import { environment } from "src/environments/environment.prod";
import { AuthService } from "../auth/auth.service";
import { Post } from "../posts/post.model";
import { PostService } from "../posts/post.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private postService: PostService, private authService: AuthService) {
    }

    storePosts() {
        const posts = this.postService.getPosts();
        this.http.put(environment.apiUrl + '/posts.json', posts).subscribe(response => {
            console.log(response);
        });
    }

    fetchPosts() {
        return this.http.get<Post[]>(environment.apiUrl + '/posts.json')
            .pipe(
                map(posts => {
                    if (posts !== null || undefined) {
                        return posts.map(post => {
                            return {
                                ...post
                            }
                        });
                    } else {
                        return []
                    }
                }),
                tap(posts => {
                    console.log(posts);
                    this.postService.setPosts(posts);
                }))
    }
}