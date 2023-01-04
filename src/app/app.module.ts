import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthComponent } from './auth/auth.component';
import { AlertComponent } from './common/alert/alert.component';
import { LoadingSpinnerComponent } from './common/loading-spinner/loading-spinner.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { PostItemComponent } from './posts/post-list/post-item/post-item.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostsComponent } from './posts/posts.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    HeaderComponent,
    PostsComponent,
    PostEditComponent,
    PostListComponent,
    PostItemComponent,
    PostDetailComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
