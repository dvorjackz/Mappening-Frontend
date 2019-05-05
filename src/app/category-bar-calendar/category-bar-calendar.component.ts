import { Component, OnInit, HostListener, Input } from '@angular/core';
import { DisplayService } from '../services/display.service';
import { FeatureCollection, GeoJson } from '../map';
import { NgClass } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-category-bar-calendar',
  templateUrl: './category-bar-calendar.component.html',
  styleUrls: ['./category-bar-calendar.component.css']
})

export class CategoryBarCalendarComponent implements OnInit {
  @Input() showToggleButton: boolean;
  private categHash = {};
  private filterHash = {};
  public selectedCategory = 'all';
  public showDropdown = false;
  private wasInside = false;

  constructor(private _displayService: DisplayService) {}

  ngOnInit() {
    this._displayService.categHash$.subscribe(categHash => {
      this.categHash = categHash;
    });
    this._displayService.buttonHash$.subscribe(filterHash => {
      this.filterHash = filterHash;
    });
    this._displayService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category;
    });
  }

  setDateFilter(){
    let firstInput = (<HTMLInputElement>document.getElementById('start-date')).value;
    let first = moment(firstInput).toDate();
    let lastInput = (<HTMLInputElement>document.getElementById('end-date')).value;
    let last = moment(lastInput).toDate();
    this._displayService.setDateFilter(first,last);
  }

  getStartDate(){
    return moment(this._displayService.getDateFilter()[0]).format('YYYY-MM-DD');
  }

  getEndDate(){
    return moment(this._displayService.getDateFilter()[1]).format('YYYY-MM-DD');
  }

  setTimeFilter(){
    let firstInput = (<HTMLInputElement>document.getElementById('start-time')).value;
    var starttime = firstInput.split(":");
    var start = parseInt(starttime[0])*60 + parseInt(starttime[1]);
    let lastInput = (<HTMLInputElement>document.getElementById('end-time')).value;
    var endtime = lastInput.split(":");
    var end = parseInt(endtime[0])*60 + parseInt(endtime[1]);
    this._displayService.setTimeFilter(start,end);
  }

  getStartTime(){
    return this.convertNumToTime(this._displayService.getTimeFilter()[0]);
  }

  getEndTime(){
    return this.convertNumToTime(this._displayService.getTimeFilter()[1]);
  }

  setLocationFilter(){
    let locInput = (<HTMLInputElement>document.getElementById('location')).value;
    this._displayService.setLocationFilter(locInput);
  }

  getLoc(){
    return this._displayService.getLocationFilter();
  }

  convertNumToTime(minutes: number){
    let hours = (Math.floor(minutes / 60))%24;
    minutes = (minutes-(hours*60))%60;
    let minString = minutes.toString();
    if(minString.length == 1){
      minString = "0"+minString;
    }
    let hourString = hours.toString();
    if(hourString.length == 1){
      hourString = "0"+hourString;
    }
    let time = hourString+":"+minString;
    return time;
  }

  filterClicked(filter: string): void {
    this._displayService.toggleFilterButton(filter);
  }

  categoryClicked(): void {
    var category = (<HTMLInputElement>document.getElementById("categories")).value;
    this._displayService.toggleCategory(category);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    this._displayService.updateCategories();
  }

  clearCategories(): void {
    for (let key in this.categHash) {
      if (this.categHash[key].selected) {
        this._displayService.toggleCategory(key);
      }
    }
    if(this.categHash){
      this.categHash["all"].selected = true;
    }
    this.selectedCategory = "all";
  }

  clearFilters(): void {
    for (let key in this.filterHash) {
      if (this.filterHash[key]) {
        this._displayService.toggleFilterButton(key);
      }
    }
  }



  clearAllFilters(){
    this._displayService.resetFilters();
  }

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.showDropdown = false;
    }
    this.wasInside = false;
  }

  private objectKeys(obj) {
    return Object.keys(obj);
  }

}
