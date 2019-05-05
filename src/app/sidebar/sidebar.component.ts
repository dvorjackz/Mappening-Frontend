import { Component, OnInit, Input, Output, HostBinding, EventEmitter } from '@angular/core';
import { DateService } from '../services/date.service';
import { DisplayService } from '../services/display.service';
import { AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FeatureCollection, GeoJson } from '../map';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [ DateService ],
    animations: [
        trigger('myAwesomeAnimation', [
            state('inactive', style({
                backgroundColor: '#eee',
                fontSize: '10px'
            })),
            state('active',   style({
                backgroundColor: '#cfd8dc',
                fontSize: '30px'
            })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
})

export class SidebarComponent implements OnInit {
    public filteredEvents: GeoJson[];
    public clickedEvent: GeoJson;
    public hoveredEvent: GeoJson;
    public mobileSidebarVisible: boolean = false;
    @Input() onPress: () => void;
    @Input() pressed$: Observable<boolean>;
    @ViewChildren('eventList') private eventList: QueryList<ElementRef>;

    constructor(
        private router: Router,
        private _displayService: DisplayService,
        private _dateService: DateService,
    ) {}

    ngOnInit() {
        // TODO: unsubscribe on destroy
        // this.router.navigate( ['', {outlets: {sidebar: ['list']}}]);
        this._displayService.filteredDayEvents$.subscribe(eventCollection => {
            this.filteredEvents = eventCollection.features;
        });
        this._displayService.clickedEvent$.subscribe(clickedEventInfo => {
            this.clickedEvent = clickedEventInfo;
            this.scrollToEvent(clickedEventInfo);
        });
        this._displayService.hoveredEvent$.subscribe(hoveredEventInfo => {
            this.hoveredEvent = hoveredEventInfo;
            this.scrollToEvent(hoveredEventInfo);
        });
        this.pressed$.subscribe(pressed => this.mobileSidebarVisible = pressed);
    }

    // Hides sidebar when event on sidebar is clicked to reveal eventDetail.
    // We want to call the function when there is a change to event we're subscribing to
    onSelect(event: GeoJson): void {
        this._displayService.updateClickedEvent(event);
        this.router.navigate(['', {outlets: {sidebar: ['detail', event.id]}}]);
        this._displayService.boldPopup(event);
    }

    onHover(event: GeoJson): void {
        this.hoveredEvent = event;
        this._displayService.updateHoveredEvent(event);
    }

    toggleMobileSidebar() {
        this.onPress();
    }

    formatCategory(categories): string {
        if (!categories) {
            return '';
        }
        let categStr: string = '';
        for (let category of categories) {
          categStr += category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() + ', ';
        }
        return categStr.slice(0, categStr.length - 2);
    }

    // scroll to the DOM element for event
    scrollToEvent(event: GeoJson): void {
      if (event) {
        const index: number = this.filteredEvents.findIndex((e: GeoJson) => e.id == event.id);
        const element: ElementRef = this.eventList.find((e: ElementRef, i: number) => index == i);
        if (element) {
          element.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }

  //check whether an image source exists
  checkImage(imageSrc) {
      var img = new Image();
      try {
        img.src = imageSrc;
        return true;
      } catch(err) {
        return false;
      }
    }

}
