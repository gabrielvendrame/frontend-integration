import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  // A Subject is like an Observable, but can multicast to many Observers.
  private postsUpdated = new Subject<{ posts: Post[], totalPosts: number }>();


  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queyParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    // Using spread Operator: I create a new array [], take the value from the input one and place it into the newest
    // Essentially is a copy
    // return [...this.posts];
    this.http.get<{ message: string, posts: any, totalPosts: number }>(BACKEND_URL + queyParams)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }), totalPosts: postData.totalPosts
          };
        })
      )
      .subscribe((transformedPostData) => {
          this.posts = transformedPostData.posts;
          // Is always better to pass a copy in this way you can't edit the original one
          this.postsUpdated.next({
            posts: [...this.posts],
            totalPosts: transformedPostData.totalPosts
          });
        }
      );
  }

  getPost(id: string) {
    return this.http
      .get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>
      (BACKEND_URL + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {id, title, content, imagePath: image, creator: null};
    }
    this.http.put(BACKEND_URL + id, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
