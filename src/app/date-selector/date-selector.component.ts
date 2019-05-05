import { Component, OnInit } from '@angular/core';
import { DisplayService } from '../services/display.service';
import { DateService } from '../services/date.service';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'app-date-selector',
    templateUrl: './date-selector.component.html',
    styleUrls: ['./date-selector.component.css']
})

export class DateSelectorComponent implements OnInit {
    public dateString: string;
    public showLeft: boolean;
    public showRight: boolean;

    constructor(private router: Router, private _displayService: DisplayService, private _dateService: DateService) { }

    ngOnInit() {
        this._displayService.currentDate$.subscribe(date => {
            this.dateString = this.dateToString(date);
            this.showLeft = this.showLeftArrow(date);
            this.showRight = this.showRightArrow(date);
        });

    }

    private showLeftArrow(date: Date): boolean {
        let today = new Date();
        return !this._dateService.equalDates(date, today);
    }

    private showRightArrow(date: Date): boolean {
        return true;
    }

    private dateToString(date: Date): string {
        let day = moment(date).format('d');
        let month = moment(date).format('MMM');
        let description = '';
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (this._dateService.equalDates(date, today)) {
            description = 'Today, ';
        }
        else if (this._dateService.equalDates(date, tomorrow)) {
            description = 'Tomorrow, ';
        }
        return `${description} ${month} ${day}`
    }

    public updateDate(days: number) {
        // 1 means advance one day, -1 means go back one day
        this._displayService.increaseDay(days);
        if(this._displayService.isMapView()){
          document.getElementById("resetButton").click();
        }
    }

}
