import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api'
import { MessageService, SelectItem } from 'primeng/api';
import { RestService } from '../service/rest.service';
import { AirportIdentfierName } from '../domain/AirportIdentfierName';
import { HttpErrorResponse } from '@angular/common/http';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Metar } from '../domain/Metar';
import { User } from '../user';
import { WindDirectionPipe } from '../pipe/wind-direction-pipe';
import { RemarkPipe } from '../pipe/remark-pipe';
import { SkyConditionPipe } from '../pipe/sky-condition-pipe';
import { StationIdSetComponent } from '../station-id-set/station-id-set.component';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DatePickerModule } from 'primeng/datepicker';
import { AuthService } from '../auth/auth.service';
import { concatMap, distinctUntilChanged } from 'rxjs';
import { StationIdSets } from '../domain/StationIdSets';

@Component({
    selector: 'app-metar',
    imports: [CommonModule, SharedModule, TabViewModule, InputTextModule, KeyFilterModule, AutoCompleteModule, DatePickerModule, ReactiveFormsModule, FormsModule, ButtonModule, TableModule, TooltipModule,
        WindDirectionPipe, RemarkPipe, SkyConditionPipe, StationIdSetComponent],
    templateUrl: './metar.component.html',
    styleUrl: './metar.component.css'
})
export class MetarComponent implements OnInit {

    metarArray: Metar[] = [];

    airportIdentfierNameResults!: Array<AirportIdentfierName>;

    loadingFlag!: boolean;

    foundIdentifierSet!: SelectItem[];

    userDetails: User = {} as User;
    loginButtonLabel!: string;

    username!: string
    stationIdSets!: StationIdSets[];

    readonly JanFirst2016: Date = new Date(2016, 0, 1, 0, 0, 0, 0) // Jan 1, 2016

    latestObservationsForm = new FormGroup({
        airportIdentfierNameArray: new FormControl<AirportIdentfierName[] | null>(null, Validators.required),
        numberOfObersvations: new FormControl<number>(1, Validators.required),
    })
    dateRangeForm = new FormGroup({
        airportIdentfierNameArray: new FormControl<AirportIdentfierName[] | null>(null, Validators.required),
        fromObservationTime: new FormControl<Date>(new Date(), { nonNullable: true, validators: Validators.required }),
        toObservationTime: new FormControl<Date>(new Date(), { nonNullable: true, validators: Validators.required }),
    })

    constructor(
        private messageService: MessageService,
        private restService: RestService,
        private authService: AuthService,
    ) {
        // this.valueChangesAirportIdentfierNameArray()
    }

    ngOnInit() {
        this.messageService.clear()
        // this.authService.getUserInfo().pipe(
        //     concatMap(userInfo => {
        //         console.log('userInfo', userInfo)
        //         this.username = userInfo.username
        //         return this.restService.getStationIdSets(this.username)
        //     })
        // ).subscribe({
        //     next: (stationIdSets: StationIdSets[]) => {
        //         this.stationIdSets = stationIdSets
        //     },
        //     complete: () => {
        //         console.log('getUserInfo() & getStationIdSets(this.username) copleted')
        //     },
        //     error: (httpErrorResponse: HttpErrorResponse) => {
        //         console.log('httpErrorResponse', httpErrorResponse)
        //     }
        // })
        this.authService.getUserInfo()
            .subscribe(userInfo => {
                console.log('userInfo', userInfo)
                this.username = userInfo.username
            })
    }

    // valueChangesAirportIdentfierNameArray() {
    //     this.latestObservationsForm.controls.airportIdentfierNameArray.valueChanges.subscribe(airportIdentfierNameArray => {
    //         console.log('in valueChangesAirportIdentfierNameArray() airportIdentfierNameArray', airportIdentfierNameArray)
    //         this.identifierArray = []
    //         airportIdentfierNameArray!.forEach(airportIdentfierName => this.identifierArray.push(airportIdentfierName.identifier))
    //     })
    // }

    onAirportIdentfierNamesChange(airportIdentfierNameArrayOfSet: AirportIdentfierName[]) {
        if (airportIdentfierNameArrayOfSet.length === 0) {
            this.latestObservationsForm.controls.airportIdentfierNameArray.reset()
        } else {
            this.latestObservationsForm.controls.airportIdentfierNameArray.setValue(airportIdentfierNameArrayOfSet)
        }
    }

    searchAirports(autoCompleteCompleteEvent: AutoCompleteCompleteEvent) {

        this.airportIdentfierNameResults = [];
        console.log('autoCompleteCompleteEvent', autoCompleteCompleteEvent);
        this.restService.getAirportIdentfierNames(autoCompleteCompleteEvent.query)
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

    onSubmitLatestObservationsForm() {
        console.log('latestObservationsForm', this.latestObservationsForm.value)
        this.metarArray.length = 0;
        this.loadingFlag = true;
        let identifiers: Array<string> = this.latestObservationsForm.value.airportIdentfierNameArray!.map(airportIdentfierName => {
            return airportIdentfierName.identifier;
        });
        // console.log('identifiers', identifiers)
        this.restService.getMetarListForLatestNObservations(identifiers, this.latestObservationsForm.value.numberOfObersvations!).subscribe({
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
    }
    onSubmitDateRangeForm() {
        console.log('dateRangeForm', this.dateRangeForm.value)
        this.metarArray.length = 0;
        this.loadingFlag = true;
        let identifiers: Array<string> = this.dateRangeForm.value.airportIdentfierNameArray!.map(airportIdentfierName => {
            return airportIdentfierName.identifier;
        });
        console.log('identifiers', identifiers)
        this.restService.getMetarListInObervationTimeRange(identifiers, this.dateRangeForm.value.fromObservationTime!, this.dateRangeForm.value.toObservationTime!).subscribe({
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

    }

}
