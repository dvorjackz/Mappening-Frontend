import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // replaces previous Http service
import { FormsModule } from '@angular/forms';

import { MapService } from './map.service';
import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { SharedComponent } from './shared/shared.component';

@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent,
    SharedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
