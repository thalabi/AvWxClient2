import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { debounceTime } from 'rxjs';
import { RestService } from '../service/rest.service';
import { AirportIdentfierName } from '../domain/AirportIdentfierName';
import { HttpErrorResponse } from '@angular/common/http';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { Metar } from '../domain/Metar';
import { User } from '../user';
import { WindDirectionPipe } from '../pipe/wind-direction-pipe';
import { RemarkPipe } from '../pipe/remark-pipe';
import { SkyConditionPipe } from '../pipe/sky-condition-pipe';

@Component({
    selector: 'app-metar',
    imports: [CommonModule, TabViewModule, AutoCompleteModule, CalendarModule, FormsModule, ButtonModule, TableModule, TooltipModule,
        WindDirectionPipe, RemarkPipe, SkyConditionPipe],
    templateUrl: './metar.component.html',
    styleUrl: './metar.component.css'
})
export class MetarComponent implements OnInit {

    airportIdentfierNameArrayCache!: Array<AirportIdentfierName>;
    metarArray: Metar[] = [];
    something: string = 'hello';

    airportIdentfierNames!: Array<AirportIdentfierName>;
    airportIdentfierNameResults!: Array<AirportIdentfierName>;

    fromObservationTime!: Date;
    toObservationTime!: Date;

    numberOfObersvations!: number;

    panelNumberSelected: MetarRetrievalMethodEnum = MetarRetrievalMethodEnum.Latest;

    loadingFlag!: boolean;

    savedstationIdSetNames!: SelectItem[];
    stationIdSetName!: string;

    foundSavedStationIdSet!: boolean;

    // savedStationIdSets: Array<StationIdSet>;

    userDetails: User = {} as User;
    loginButtonLabel!: string;

    // @ViewChildren(StationIdSetComponent) stationIdSetComponentReferences: QueryList<StationIdSetComponent>;

    // @ViewChild(LoginPanelComponent) loginPanelComponent: LoginPanelComponent;

    constructor(
        private messageService: MessageService,
        private restService: RestService,
    ) { }

    ngOnInit() {
        this.messageService.clear()
        // this.getAirportIdentfiersAndNames()
    }

    // getAirportIdentfiersAndNames() {
    //     this.restService.getAirportIdentfierNames()
    //         .subscribe(
    //             {
    //                 next: (airportIdentfierNames: AirportIdentfierName[]) => {
    //                     console.log('airportIdentfierNames', airportIdentfierNames);
    //                     this.airportIdentfierNameArrayCache = airportIdentfierNames;
    //                 },
    //                 complete: () => {
    //                     console.log('this.restService.getAirportIdentfierNames completed')
    //                 }
    //                 ,
    //                 error: (httpErrorResponse: HttpErrorResponse): void => {
    //                     console.log('httpErrorResponse', httpErrorResponse)
    //                 }
    //             });
    // }

    searchAirports(autoCompleteCompleteEvent: AutoCompleteCompleteEvent /*{ originalEvent: InputEvent, query: string }*/) {

        this.airportIdentfierNameResults = [];//new Array<MetarStationIdMv>();
        console.log('autoCompleteCompleteEvent', autoCompleteCompleteEvent);
        // this.airportIdentfierNameResults =
        //     this.airportIdentfierNameArrayCache.filter(e => e.identifier.indexOf(autoCompleteCompleteEvent.query.toUpperCase()) > -1).concat(
        //         this.airportIdentfierNameArrayCache.filter(e => e.name.indexOf(autoCompleteCompleteEvent.query.toUpperCase()) > -1)
        //     );
        this.restService.getAirportIdentfierNames2(autoCompleteCompleteEvent.query)
            .pipe(debounceTime(300)) // delay 300 ms
            .subscribe(
                {
                    next: (airportIdentfierNames: AirportIdentfierName[]) => {
                        console.log('airportIdentfierNames', airportIdentfierNames);
                        this.airportIdentfierNameResults = airportIdentfierNames;
                    },
                    complete: () => {
                        console.log('this.restService.getAirportIdentfierNames completed')
                    }
                    ,
                    error: (httpErrorResponse: HttpErrorResponse): void => {
                        console.log('httpErrorResponse', httpErrorResponse)
                    }
                });
        console.log(this.airportIdentfierNameResults)
    }

    getMetars() {
        this.metarArray.length = 0;
        this.loadingFlag = true;
        console.log(this.airportIdentfierNames);
        let stationIds: Array<string> = this.airportIdentfierNames.map(airportIdentfierName => {
            return airportIdentfierName.identifier;
        });
        switch (this.panelNumberSelected) {
            case MetarRetrievalMethodEnum.Latest:
                localStorage.setItem('numberOfObersvations', this.numberOfObersvations.toString());
                this.restService.getMetarListForLatestNObservations(stationIds, this.numberOfObersvations).subscribe({
                    next: rowResponse => {
                        console.log('metar rowResponse: ', rowResponse);
                        this.metarArray = rowResponse;
                        console.log('metarArray: ', this.metarArray);
                    },
                    complete: () => {
                        this.loadingFlag = false;
                    },
                    error: error => {
                        console.error('MetarComponent:ngOnInit()', error);
                        //this.messageService.error(error);
                    }
                });
                break;
            case MetarRetrievalMethodEnum.Range:
                this.restService.getMetarListInObervationTimeRange(stationIds, this.fromObservationTime, this.toObservationTime).subscribe({
                    next: rowResponse => {
                        console.log('metar rowResponse: ', rowResponse);
                        this.metarArray = rowResponse;
                        console.log('metarArray: ', this.metarArray);
                    },
                    complete: () => {
                        this.loadingFlag = false;
                    },
                    error: error => {
                        console.error('MetarComponent:ngOnInit()', error);
                        //this.messageService.error(error);
                    }
                });
                break;
        }
    }


    setPanelNumberSelected(event: TabViewChangeEvent): void {
        console.log('event.index', event.index);
        this.panelNumberSelected = event.index;
        console.log(this.panelNumberSelected);
        this.metarArray = new Array<Metar>();

        // refresh child component from localstorage
        // let stationIdSetComponent = this.stationIdSetComponentReferences.find(stationIdSetComponent => stationIdSetComponent.id == event.index);
        // if (stationIdSetComponent) {
        //     console.log('found stationIdSetComponent');
        //     stationIdSetComponent.refreshFromLocalStorage();
        // }
    }
    clearMetarStationIdMvs() {
        this.airportIdentfierNames.length = 0;
    }

}
enum MetarRetrievalMethodEnum {
    Latest, // by number of latest metars
    Range // by observation date range
}
