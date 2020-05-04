import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './errors/error.component';
import { AuthRoutingModule } from './auth/auth.routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { WaveformComponent } from './posts/waveform/waveform.component';
import { AudioPlayerComponent } from './posts/audio-player/audio-player.component';
import { UploadDialogComponent } from './posts/upload-dialog/upload-dialog.component';
import { UploadService } from './services/upload.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    CreatePostComponent,
    HeaderComponent,
    PostListComponent,
    ErrorComponent,
    AudioPlayerComponent,
    WaveformComponent,
    UploadDialogComponent
  ],
  imports: [
    AuthRoutingModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    MatProgressBarModule,
  ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    UploadService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, UploadDialogComponent]
})
export class AppModule {
}
