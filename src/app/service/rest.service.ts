import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Metar } from '../domain/Metar';
import { DatePipe } from '@angular/common';
import { AirportIdentfierName } from '../domain/AirportIdentfierName';

@Injectable({
    providedIn: 'root'
})
export class RestService {
    readonly serviceUrl: string;

    constructor(
        private httpClient: HttpClient,
        private datePipe: DatePipe
    ) {
        this.serviceUrl = environment.beRestServiceUrl;
    }

    getAirportIdentfierNames(): Observable<AirportIdentfierName[]> {
        return this.httpClient.get<AirportIdentfierName[]>(`${this.serviceUrl}/protected/airportController/getAirportIdentfierNames`);
    }
    getAirportIdentfierNames2(idOrName: string): Observable<AirportIdentfierName[]> {
        return this.httpClient.get<AirportIdentfierName[]>(`${this.serviceUrl}/protected/airportController/getAirportIdentfierNames?idOrName=${idOrName}`);
    }

    getMetarListForLatestNObservations(stationIds: Array<string>, numberOfObersvations: number): Observable<Metar[]> {
        const stationIdsConcatenated: string = stationIds.join(",")
        let url: string = `${this.serviceUrl}/protected/metarQueryController/getListForLatestNoOfObservations?stationIds=${stationIdsConcatenated}&noOfObservations=${numberOfObersvations}`;
        return this.httpClient.get<Metar[]>(`${this.serviceUrl}/protected/metarQueryController/getListForLatestNoOfObservations?stationIds=${stationIdsConcatenated}&noOfObservations=${numberOfObersvations}`)
    }

    getMetarListInObervationTimeRange(stationIds: Array<string>, fromObservationTime: Date, toObservationTime: Date): Observable<Metar[]> {
        let stationIdsConcatenated: string = stationIds.join("&stationId=");
        let fromObservationTimeString = this.datePipe.transform(fromObservationTime, "yyyy-MM-dd");
        let toObservationTimeString = this.datePipe.transform(toObservationTime, "yyyy-MM-dd");
        return this.httpClient.get<Metar[]>(`${this.serviceUrl}/protected/metarQueryController/getMetarListInObervationTimeRange?stationIds=${stationIdsConcatenated}&fromObservationTime=${fromObservationTimeString}T00:00&toObservationTime=${toObservationTimeString}T23:59`);
    }

}
