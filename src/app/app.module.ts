import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VjInputModule } from './shared/components/vj-input/vj-input.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    VjInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
