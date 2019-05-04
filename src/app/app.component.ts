import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CategoryService } from './services/category.service';
import { GeoJson, FeatureCollection } from './map';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'mappening';

  public mapEvents: FeatureCollection;

  constructor(private _categService: CategoryService){}

  public pressed: boolean;
  public pressed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    // this._categService.getCategories()
    //   .subscribe(categs => console.log(categs));
    this.pressed$.subscribe(pressed => this.pressed = pressed);
  }

  onPress(): void {
      this.pressed$.next(!this.pressed);
  }

  onSidebarRouterActivate(component: any): void {
    if (component instanceof SidebarComponent) {
      component.onPress = () => this.onPress();
      component.pressed$ = this.pressed$.asObservable();
    }
  }

}
