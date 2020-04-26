import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  // A Subject is like an Observable, but can multicast to many Observers.
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    // Using spread Operator: I create a new array [], take the value from the input one and place it into the newest
    // Essentially is a copy
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title,
      content
    };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
