import { Component, OnInit, HostListener, Input } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { DateService } from '../services/date.service'
import { EventService } from '../services/display.service';
import { FeatureCollection, GeoJson } from '../map';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-category-bar-map',
  templateUrl: './category-bar-map.component.html',
  styleUrls: ['./category-bar-map.component.css']
})

export class CategoryBarMapComponent implements OnInit {
  @Input() showToggleButton: boolean;
  private categHash = undefined;
  private filterHash = undefined;
  private events: GeoJson[];
  public selectedCategory = 'all categories';
  public showDropdown = false;
  private wasInside = false;

  constructor(private _categService: CategoryService, private _eventService: EventService, private _dateService: DateService) {}

  ngOnInit() {
    this._eventService.dayEvents$.subscribe(eventCollection => {
      this.events = eventCollection.features;
    });
    this._eventService.categHash$.subscribe(categHash => {
      this.categHash = categHash;
    });
    this._eventService.filterHash$.subscribe(filterHash => {
      this.filterHash = filterHash;
    });
  }

  filterClicked(filter: string): void {
    this._eventService.toggleFilterButton(filter);
  }

  categoryClicked(category: string): void {
    this._eventService.toggleCategory(category);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  clearCategories(): void {
    for (let key in this.categHash) {
      if (this.categHash[key].selected) {
        this._eventService.toggleCategory(key);
      }
    }
  }

  clearFilters(): void {
    for (let key in this.filterHash) {
      if (this.filterHash[key]) {
        this._eventService.toggleFilterButton(key);
      }
    }
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
