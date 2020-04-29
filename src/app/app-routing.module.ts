import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { LoginComponent } from './auth/login/login.component';


const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'create', component: CreatePostComponent},
  {path: 'edit/:postId', component: CreatePostComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
