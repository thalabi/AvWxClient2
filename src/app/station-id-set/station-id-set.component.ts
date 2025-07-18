import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormControl, FormsModule } from '@angular/forms';
import { AirportIdentfierName } from '../domain/AirportIdentfierName';
import { ButtonModule } from 'primeng/button';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { StationIdSets } from '../domain/StationIdSets';
import { RestService } from '../service/rest.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-station-id-set',
    imports: [CommonModule, ToastModule, SelectModule, FormsModule, ButtonModule],
    templateUrl: './station-id-set.component.html',
    styleUrl: './station-id-set.component.css'
})
export class StationIdSetComponent implements OnInit {

    nameToStationIdSetsMap: Map<string, AirportIdentfierName[]> = new Map()
    stationIdSetsUrl!: URL | null;
    // setKeys: string[] = []

    @Input() id!: number

    @Input() username!: string
    // The value of airportIdentfierNamesControl is updated effectively making it a two-way binding parameter
    @Input() airportIdentfierNamesControl!: FormControl

    airportSetName!: string
    selectedAirportSetName!: string | null

    setFound: boolean = false

    constructor(private messageService: MessageService, private restService: RestService) { }

    ngOnInit(): void {
        console.log('StationIdSetComponent id is', this.id)
        this.getNameToStationIdSetsMap()
    }
    getNameToStationIdSetsMap() {
        this.restService.getStationIdSets(this.username)
            .subscribe((stationIdSets: StationIdSets | null) => {
                if (stationIdSets) {
                    console.log('stationIdSets', stationIdSets)
                    this.nameToStationIdSetsMap = stationIdSets.nameToStationIdSetsMap
                    this.stationIdSetsUrl = stationIdSets._links?.self.href!
                    console.log('this.stationIdSetsUrl', this.stationIdSetsUrl)
                } else {
                    this.stationIdSetsUrl = null
                }
            })
    }

    onSelectAirportSetName(event: SelectChangeEvent) {
        console.log('in onChangeAirportSetName');
        this.selectedAirportSetName = event.value
        console.log('this.selectedAirportSetName', this.selectedAirportSetName, 'this.selectedAirportSetName.length', this.selectedAirportSetName!.length)
        if (!this.selectedAirportSetName || this.selectedAirportSetName.length == 0) {
            this.setFound = false
            return
        }
        if (this.mapKeys.find(setName => setName === this.selectedAirportSetName)) {
            console.log('airportSetName found')
            this.setFound = true

            this.airportIdentfierNamesControl.setValue(this.nameToStationIdSetsMap.get(this.selectedAirportSetName))
            console.log('this.airportIdentfierNamesControl.value', this.airportIdentfierNamesControl.value)
        } else {
            console.log('airportSetName not found')
            this.setFound = false
        }
    }
    addAirportSet() {
        console.log('in addAirportSet');
        console.log('this.airportIdentfierNamesControl.value', this.airportIdentfierNamesControl.value)
        if (!this.airportIdentfierNamesControl.value || this.airportIdentfierNamesControl.value.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Add station id(s) first', life: 3000 });
            return
        }
        this.nameToStationIdSetsMap.set(this.selectedAirportSetName!, this.airportIdentfierNamesControl.value)
        console.log('this.nameToStationIdSetsMap', this.nameToStationIdSetsMap)
        this.persistStationIdSets()
        this.setFound = true

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Added', life: 3000 });
    }
    modifyAirportSet(): void {
        console.log('in modifyAirportSet');
        this.nameToStationIdSetsMap.set(this.selectedAirportSetName!, this.airportIdentfierNamesControl.value)
        console.log('this.nameToStationIdSetsMap', this.nameToStationIdSetsMap)
        this.persistStationIdSets()
        this.setFound = true

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Modified', life: 3000 });
    }
    deleteStationIdSet(): void {
        console.log('in deleteStationIdSet');
        this.nameToStationIdSetsMap.delete(this.selectedAirportSetName!)
        this.selectedAirportSetName = ''
        console.log('this.nameToStationIdSetsMap', this.nameToStationIdSetsMap)
        this.persistStationIdSets()
        this.airportIdentfierNamesControl.setValue([])
        this.airportIdentfierNamesControl.reset()
        this.selectedAirportSetName = null
        this.setFound = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted', life: 3000 });
    }
    get mapKeys(): string[] {
        return Array.from(this.nameToStationIdSetsMap.keys());
    }

    private persistStationIdSets() {
        console.log('this.nameToStationIdSetsMap', this.nameToStationIdSetsMap)

        if (this.stationIdSetsUrl) {

            // delete stationIdSets
            if (this.nameToStationIdSetsMap.size === 0) {
                this.restService.deleteStationIdSets(this.stationIdSetsUrl)
                    .subscribe(
                        {
                            next: (response: any) => {
                                console.log('response', response)
                            },
                            complete: () => {
                                console.log('http request completed')
                            },
                            error: (httpErrorResponse: HttpErrorResponse) => {
                                console.log('httpErrorResponse', httpErrorResponse)
                            }
                        })

            } else {

                // update stationIdSets
                const stationIdSets: StationIdSets = {
                    username: this.username,
                    nameToStationIdSetsMap: this.nameToStationIdSetsMap,
                    _links: {
                        self: {
                            href: this.stationIdSetsUrl
                        },
                        stationIdSets: {
                            href: this.stationIdSetsUrl
                        }
                    }
                }

                this.restService.updateStationIdSets(stationIdSets)
                    .subscribe(
                        {
                            next: (response: any) => {
                                console.log('response', response)
                            },
                            complete: () => {
                                console.log('http request completed')
                            },
                            error: (httpErrorResponse: HttpErrorResponse) => {
                                console.log('httpErrorResponse', httpErrorResponse)
                            }
                        })
            }
        } else {

            // insert stationIdSets
            const stationIdSets: StationIdSets = {
                username: this.username,
                nameToStationIdSetsMap: this.nameToStationIdSetsMap
            }

            this.restService.addStationIdSets(stationIdSets)
                .subscribe(
                    {
                        next: (response: any) => {
                            console.log('response', response)
                            this.stationIdSetsUrl = response._links.self.href
                        },
                        complete: () => {
                            console.log('http request completed')
                        },
                        error: (httpErrorResponse: HttpErrorResponse) => {
                            console.log('httpErrorResponse', httpErrorResponse)
                        }
                    })

        }
    }
}
