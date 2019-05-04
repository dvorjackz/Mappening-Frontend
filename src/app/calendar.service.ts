import { Injectable, Output } from '@angular/core';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { EventEmitter } from '@angular/core';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { EventService } from './event.service';
import { GeoJson } from './map';
import * as moment from 'moment';

// Calendar Day interface
interface CalendarDay {
  // day of month
  dayOfMonth: number;
  // month as number
  month: number;
  // year as number
  year: number;
  // events on day
  events: GeoJson[];
  // is day selected
  selected: boolean;
  // is day in the current month
  inCurrentMonth: boolean;
}

@Injectable({providedIn: 'root'})
export class CalendarService {

  // span of dates being shown on screen
  dateSpanSource: Subject <any>;
  dateSpan$;

  constructor(private router: Router, private _eventService: EventService) {
    this.dateSpanSource = new Subject < any > ();
    this.dateSpan$ = this.dateSpanSource.asObservable();
  }

  // date change
  delta : Number = 0;

  // day variables
  selectedDay: CalendarDay;
  days: CalendarDay[] = [];

  storedView: string;

  @Output() change: EventEmitter<Number> = new EventEmitter();
  @Output() selectedDayChange: EventEmitter<CalendarDay> = new EventEmitter();

  changeDateSpan(delta : Number) {
    let span = {};
    this.dateSpanSource.next(span);
    this.delta = delta;
    this.change.emit(this.delta);
    this.delta = 0;
    this.selectedDay = this.days[0];
    if(delta == 0){
      if(this.router.url.startsWith('/calendar/week')){
        this.storeView('month');
      } else {
        this.storeView('week');
      }
    }
  }

  storeView(view: string){
    this.storedView = view;
  }

  retrieveLastView(){
    return this.storedView;
  }

  getLink(){
    return "/calendar";
  }

  getSelectedDay() {
    return this.selectedDay;
  }

  setSelectedDay(day: CalendarDay) {
    this.selectedDay = day;
    this.selectedDayChange.emit(day);
  }

  setDays(calendarDays: CalendarDay[]){
    this.days = calendarDays;
    this._eventService.calendarServiceDays = calendarDays;
  }

  increaseDay(days: number){
    var currIndex = this.days.indexOf(this.selectedDay);
    currIndex += days;
    if(this.selectedDay.dayOfMonth == this._eventService.getSelectedDay().getDate()){
      if(currIndex < this.days.length && currIndex > -1){
        this.setSelectedDay(this.days[currIndex]);
      }
    }
  }

  isMonthView() {
    if(this.router.url.startsWith("/calendar/month"))
      this.storedView = 'month';
    return this.router.url.startsWith("/calendar/month");
  }

  isWeekView() {
    if(this.router.url.startsWith("/calendar/week"))
      this.storedView = 'week';
    return this.router.url.startsWith("/calendar/week");
  }

  isMapView() {
    if(this.router.url.startsWith("/map"))
      this.storedView = 'map';
    return this.router.url.startsWith("/map");
  }

}
