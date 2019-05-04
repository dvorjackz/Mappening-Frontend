import { Injectable, Output } from '@angular/core';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { EventEmitter } from '@angular/core';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { EventService } from './event.service';
import { GeoJson } from '../map';
import * as moment from 'moment';

// Calendar Day interface
interface CalendarDay {
  dayOfMonth: number;         // day of month
  month: number;              // month as number
  year: number;               // year as number
  events: GeoJson[];          // events on day
  selected: boolean;          // is day selected
  inCurrentMonth: boolean;    // is day in the current month
}

@Injectable({providedIn: 'root'})
export class CalendarService {

  // span of dates being shown on screen
  dateSpanSource: Subject <any>;
  dateSpan$;
  // current CalendarDays within span
  days: CalendarDay[] = [];
  // currently selected day in CalendarDay format
  selectedDay: CalendarDay;
  // most recent calendar view (week/month)
  storedView: string;
  // date change
  delta : Number = 0;

  // initialize date span observable
  constructor(private router: Router, private _eventService: EventService) {
    this.dateSpanSource = new Subject < any > ();
    this.dateSpan$ = this.dateSpanSource.asObservable();
  }

  // emit changes
  @Output() change: EventEmitter<Number> = new EventEmitter();
  @Output() selectedDayChange: EventEmitter<CalendarDay> = new EventEmitter();

  // modify span of dates being shown on screen
  changeDateSpan(delta : Number) {
    // clear date span
    let span = {};
    this.dateSpanSource.next(span);
    // apply change
    this.delta = delta;
    this.change.emit(this.delta);
    // select the first day
    this.selectedDay = this.days[0];
    // store most recent calendar view
    if(delta == 0){
      if(this.router.url.startsWith('/calendar/week'))
        this.storeView('month');
      else
        this.storeView('week');
    }
  }

  getSelectedDay() {
    return this.selectedDay;
  }

  setSelectedDay(day: CalendarDay) {
    this.selectedDay = day;
    this.selectedDayChange.emit(day);
  }


    // advance seleto the next day
    increaseDay(days: number){
      var currIndex = this.days.indexOf(this.selectedDay);
      currIndex += days;
      if(this.selectedDay.dayOfMonth == this._eventService.getSelectedDay().getDate()){
        if(currIndex < this.days.length && currIndex > -1){
          this.setSelectedDay(this.days[currIndex]);
        }
      }
    }

  // store the most recent view
  storeView(view: string){
    this.storedView = view;
  }

  // retrieve the last stored view
  retrieveLastView(){
    return this.storedView;
  }

  // set the current calendar days
  setDays(calendarDays: CalendarDay[]){
    this.days = calendarDays;
    this._eventService.calendarServiceDays = calendarDays;
  }

  // test if app is currently in calendar view
  isCalendarView() {
    if(!this.router.url.startsWith("/calendar"))
      this.storedView = 'map';
    return this.router.url.startsWith("/calendar");
  }

  // test if app is currently in month view
  isMonthView() {
    if(this.router.url.startsWith("/calendar/month"))
      this.storedView = 'month';
    return this.router.url.startsWith("/calendar/month");
  }

  // test if app is currently in week view
  isWeekView() {
    if(this.router.url.startsWith("/calendar/week"))
      this.storedView = 'week';
    return this.router.url.startsWith("/calendar/week");
  }

}
