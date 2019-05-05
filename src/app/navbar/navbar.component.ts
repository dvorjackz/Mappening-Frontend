import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { CalendarService } from '../services/calendar.service';
import { EventService } from '../services/display.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
    @Output() changeView: EventEmitter<string> = new EventEmitter();

    isMapSelected: boolean;

    constructor(private _eventService: EventService, private _categService: CategoryService, private _calendarService: CalendarService, private _router: Router) {
      this._eventService.currDate$.subscribe( day => {
        if(!this._calendarService.isCalendarView()){
          this.isMapSelected = true;
        } else {
          this.isMapSelected = false;
        }
      });
    }
    ngOnInit() { }

    isCollapsed: boolean = true;

    emitChangeView(newView: string): void {
      this.changeView.emit(newView);
      let d = new Date();
      if(this._eventService.getSelectedDay() != null){
        d = this._eventService.getSelectedDay();
      }
      this._eventService.updateDayEvents(d);
      let monthyear = d.getMonth() + " " + d.getFullYear();
      this._eventService.updateMonthEvents(monthyear);
      this._eventService.updateWeekEvents(d);
      this._eventService.resetFilters();
      if(newView == 'map'){
          this._eventService.allCategories();
      } else {
        this._eventService.initTimeHash(0,1439);
        this._eventService.setLocationSearch("");
        this._eventService.setUniversalSearch("");
      }
    }

    public isFilterCollapsed: boolean = true;

    toggleMenuCollapse(): void {
      this.isCollapsed = !this.isCollapsed;
      this.isFilterCollapsed = true;
    }

    toggleFilterButtonCollapse(): void {
      this.isFilterCollapsed = !this.isFilterCollapsed;
      this.isCollapsed = true;
    }

    toggleViews(): void {
        if (this._calendarService.isCalendarView()) {
            this.emitChangeView('map');
            this.isMapSelected = true;
            this._router.navigateByUrl('/map(sidebar:list)');
        }
        else {
            this.isMapSelected = false;
            if (this._calendarService.retrieveLastView() == 'week'){
                this.emitChangeView('week')
                this._router.navigateByUrl('/calendar/week(sidebar:list)');
            }
            else {
                this.emitChangeView('month')
                this._router.navigateByUrl('/calendar/month(sidebar:list)');
            }
        }
    }

    // mark .views-switch as ng-not-empty ng-valid
    // mark .views-switch-text as ng-pristine ng-untouched ng-valid ng-not-empty
}
