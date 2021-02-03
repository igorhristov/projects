import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Post } from "./post.model";

// this can be done inside modules inside app module inside providers
@Injectable({ providedIn: 'root' })

export class PostService {
  // private === you cant edit from outside
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    // return [...this.posts];
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      })
  }
  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content }

    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);

        this.posts.push(post)
        this.postUpdated.next([...this.posts])
      })
  }


  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts])
      })
  }
}
