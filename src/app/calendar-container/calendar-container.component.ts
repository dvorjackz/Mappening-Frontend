import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { ContentChild } from '@angular/core';
import { MonthComponent } from '../month/month.component';
import { WeekComponent } from '../week/week.component';
import { CalendarService } from '../calendar.service';
import { EventService } from '../event.service';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-calendar-container',
  templateUrl: './calendar-container.component.html',
  styleUrls: ['./calendar-container.component.css'],
  providers: [WeekComponent, MonthComponent]
})

export class CalendarContainerComponent implements OnInit {
  public viewDate: Date = new Date();
  currentPath = '';

  @ContentChild(MonthComponent)
  private monthComponent: MonthComponent;

  @ContentChild(WeekComponent)
  private weekComponent: WeekComponent;

  // week number
  weekNumber: string;
  // retrieved from UCLA online academic calendar
  zeroWeeks: Moment[] = [
    //2018-2019
    moment([2018,8,23]),
    moment([2019,0,6]),
    moment([2019,2,30]),
    //2019-2020
    moment([2019,8,22]),
    moment([2020,0,5]),
    moment([2020,2,29]),
    //2020-2021
    moment([2020,8,27]),
    moment([2021,0,4]),
    moment([2021,2,29]),
    //2021-2022
    moment([2021,8,19]),
    moment([2022,0,2]),
    moment([2022,2,28]),
    //2022-2023
    moment([2022,8,19]),
    moment([2023,0,9]),
    moment([2023,3,2])
  ];

  constructor(public router: Router, private _eventService: EventService, route: ActivatedRoute, private _calendarService: CalendarService) {
    this.currentPath = route.snapshot.url.join('');
  }

  ngOnInit() {
    this._eventService.currDate$.subscribe( function(set) { this.viewDateChange(set); }.bind(this));
    this.enumerateWeek();
  }

  viewDateChange(set : Date) {
    this.viewDate = set;
  }

  changeDateSpan(delta: number) : void{
    this._calendarService.changeDateSpan(delta);
    this.enumerateWeek();
    //this._calendarService.storeView('week');
    return;
  }

  //set the week number
  enumerateWeek(){
    //count weeks
    var weekCount;
    //iterate backwards through zeroWeeks array to find the first positive week
    for(var i = this.zeroWeeks.length-1; i>=0; i--){
      //determine week count
      weekCount = Math.floor(moment(this._eventService.getSelectedDay()).diff(this.zeroWeeks[i],'days') / 7);
      //handle zero week
      if(weekCount>=0){ if(i%3 != 0){ weekCount++; } i = -1; }
    }
    // Week 11 -> Finals Week
    if(weekCount == 11){
      this.weekNumber = "finals week";
    }
    // Week 12+ or Week 0- -> Break
    else if(weekCount > 11 || weekCount < 0 || weekCount == undefined){
      this.weekNumber = "";
    }
    // Week 0-12 -> Within Quarter
    else {
      this.weekNumber = "week " + weekCount;
    }
  }

  public getWeekNumber(){
    return this.weekNumber;
  }

}
