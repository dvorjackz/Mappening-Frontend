import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FeatureCollection, GeoJson } from '../map';
import * as moment from 'moment';

@Injectable()
export class ViewService {

  // VIEW VARIABLES
  private _currentView;               // stores either 'month' 'week' or 'map'
  private _lastCalendarView;          // stores either 'month' or 'week'

  // SOURCES
  private currentViewSource: Subject <string>; currentView$;

  // Constructor
  constructor(private router: Router, private http: HttpClient) {
    // Subscribe to current view
    this.currentViewSource = new Subject <string> ();
    this.currentView$ = this.currentViewSource.asObservable();
    this.currentView$.subscribe(view => this._currentView = view);
    // Determine current view settings
    this.isMapView();
    this.isCalendarView();
    this.isMonthView();
    this.isWeekView();
  }

  // CHANGE DATE SPAN (dates displayed on screen) //

  // emit when transitioning within week or month to week
  @Output() changeToWeek: EventEmitter<Number> = new EventEmitter();
  // emit when transitioning within month or week to month
  @Output() changeToMonth: EventEmitter<Number> = new EventEmitter();
  // call when date span should be changed
  changeDateSpan(delta : Number) {
    if(delta == 0){
      if(this.isWeekView()){ this.changeToMonth.emit(delta); }
      else { this.changeToWeek.emit(delta); }
    } else {
      if(this.isWeekView()){ this.changeToWeek.emit(delta); }
      else{ this.changeToMonth.emit(delta); }
    }
  }

  // VIEW CHECKERS //

  // test if app is currently in map view
  isMapView() {
    if(this.router.url.startsWith("/map")){
      this.currentViewSource.next('map');
    } return this.router.url.startsWith("/map");
  }

  // test if app is currently in calendar view
  isCalendarView() {
    return this.router.url.startsWith("/calendar");
  }

  // test if app is currently in month view
  isMonthView() {
    if(this.router.url.startsWith("/calendar/month")){
      this.currentViewSource.next('month');
      this.storeLastView('month');
    } return this.router.url.startsWith("/calendar/month");
  }

  // test if app is currently in week view
  isWeekView() {
    if(this.router.url.startsWith("/calendar/week")){
      this.currentViewSource.next('week');
      this.storeLastView('week');
    } return this.router.url.startsWith("/calendar/week");
  }

  // currently displayed view
  getCurrentView() { return this._currentView; }
  // store the most recents view
  storeLastView(view: string){ this._lastCalendarView = view; }
  retrieveLastView(){ return this._lastCalendarView; }

}
