import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { AuthGuard } from './auth/auth-guard';
import { AudioPlayerComponent } from './posts/audio-player/audio-player.component';


const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'music', component: AudioPlayerComponent},
  {path: 'create', component: CreatePostComponent, canActivate: [AuthGuard]},
  {path: 'edit/:postId', component: CreatePostComponent, canActivate: [AuthGuard]},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
