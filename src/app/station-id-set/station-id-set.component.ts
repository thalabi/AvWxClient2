import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { AirportIdentfierName } from '../domain/AirportIdentfierName';
import { ButtonModule } from 'primeng/button';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

@Component({
    selector: 'app-station-id-set',
    imports: [ToastModule, SelectModule, FormsModule, ButtonModule],
    templateUrl: './station-id-set.component.html',
    styleUrl: './station-id-set.component.css'
})
export class StationIdSetComponent implements OnInit {

    setMap: Map<string, AirportIdentfierName[]> = new Map()
    setKeys: string[] = []

    @Input() id!: number;

    @Input() airportIdentfierNames: AirportIdentfierName[] = [];
    @Output() airportIdentfierNamesChange: EventEmitter<AirportIdentfierName[]> = new EventEmitter();

    airportSetName!: string;
    selectedAirportSetName!: string;

    setFound: boolean = false

    constructor(private messageService: MessageService) { }

    ngOnInit(): void {
        console.log('StationIdSetComponent id is', this.id);
    }

    onChangeAirportSetName(event: SelectChangeEvent) {
        console.log('in onChangeAirportSetName');
        this.selectedAirportSetName = event.value;
        console.log('this.selectedAirportSetName', this.selectedAirportSetName, 'this.selectedAirportSetName.length', this.selectedAirportSetName.length);
        if (this.selectedAirportSetName.length == 0) {
            this.setFound = false
            return
        }
        if (this.setKeys.find(setName => setName === this.selectedAirportSetName)) {
            console.log('airportSetName found')
            this.setFound = true

            this.airportIdentfierNames = this.setMap.get(this.selectedAirportSetName)!
            this.airportIdentfierNamesChange.emit(this.airportIdentfierNames)
            console.log('this.airportIdentfierNames', this.airportIdentfierNames)
        } else {
            console.log('airportSetName not found')
            this.setFound = false
        }
    }
    addAirportSet() {
        console.log('in addAirportSet');
        this.setMap.set(this.selectedAirportSetName, this.airportIdentfierNames)
        console.log('this.setMap', this.setMap)
        this.setKeys = Array.from(this.setMap.keys());
        console.log('this.setKeys', this.setKeys)
        this.setFound = true
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Added', life: 3000 });
    }
    modifyAirportSet(): void {
        console.log('in modifyAirportSet');
        this.setMap.set(this.selectedAirportSetName, this.airportIdentfierNames)
        console.log('this.setMap', this.setMap)
        this.setKeys = Array.from(this.setMap.keys());
        console.log('this.setKeys', this.setKeys)
        this.setFound = true
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Modified', life: 3000 });
    }
    public deleteStationIdSet(): void {
        console.log('in deleteStationIdSet');
        this.setMap.delete(this.selectedAirportSetName)
        this.selectedAirportSetName = ''
        console.log('this.setMap', this.setMap)
        this.airportIdentfierNames = []
        this.airportIdentfierNamesChange.emit(this.airportIdentfierNames)
        this.setKeys = Array.from(this.setMap.keys());
        console.log('this.setKeys', this.setKeys)
        this.setFound = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted', life: 3000 });
    }
}
