import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // replaces previous Http service
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';

import { MapService } from './map.service';
import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';

@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
