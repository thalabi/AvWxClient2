import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Metar } from '../domain/Metar';
import { DatePipe } from '@angular/common';
import { AirportIdentfierName } from '../domain/AirportIdentfierName';
import { StationIdSets, StationIdSetsRaw } from '../domain/StationIdSets';

@Injectable({
    providedIn: 'root'
})
export class RestService {
    readonly serviceUrl: string;
    readonly limit: number = 100

    constructor(
        private httpClient: HttpClient,
        private datePipe: DatePipe
    ) {
        this.serviceUrl = environment.beRestServiceUrl;
    }

    getAirportIdentfierNames(idOrName: string): Observable<AirportIdentfierName[]> {
        return this.httpClient.get<AirportIdentfierName[]>(`${this.serviceUrl}/protected/airportController/getAirportIdentfierNames?idOrName=${idOrName}&limit=${this.limit}`);
    }

    getMetarListForLatestNObservations(stationIds: Array<string>, numberOfObersvations: number): Observable<Metar[]> {
        let stationIdsConcatenated: string = stationIds.join("&stationIds=");
        let url: string = `${this.serviceUrl}/protected/metarQueryController/getListForLatestNoOfObservations?stationIds=${stationIdsConcatenated}&noOfObservations=${numberOfObersvations}`;
        return this.httpClient.get<Metar[]>(`${this.serviceUrl}/protected/metarQueryController/getListForLatestNoOfObservations?stationIds=${stationIdsConcatenated}&noOfObservations=${numberOfObersvations}`)
    }

    getMetarListInObervationTimeRange(stationIds: Array<string>, fromObservationTime: Date, toObservationTime: Date): Observable<Metar[]> {
        let stationIdsConcatenated: string = stationIds.join("&stationIds=");
        let fromObservationTimeString = this.datePipe.transform(fromObservationTime, "yyyy-MM-dd");
        let toObservationTimeString = this.datePipe.transform(toObservationTime, "yyyy-MM-dd");
        return this.httpClient.get<Metar[]>(`${this.serviceUrl}/protected/metarQueryController/getMetarListInObervationTimeRange?stationIds=${stationIdsConcatenated}&fromObservationTime=${fromObservationTimeString}T00:00&toObservationTime=${toObservationTimeString}T23:59`);
    }

    // getStationIdSets(username: string): Observable<StationIdSets> {
    //     return this.httpClient.get<StationIdSets>(`${this.serviceUrl}/protected/data-rest/stationIdSetses/search/findByUsername?username=${username}`);
    // }

    getStationIdSetsOld(username: string): Observable<StationIdSets> {
        return this.httpClient
            .get<StationIdSetsRaw>(`${this.serviceUrl}/protected/data-rest/stationIdSetses/search/findByUsername?username=${username}`)
            .pipe(
                map((stationIdSetsRaw: StationIdSetsRaw): StationIdSets => {
                    console.log('stationIdSetsRaw', stationIdSetsRaw)
                    const mapObject = new Map<string, AirportIdentfierName[]>(
                        Object.entries(stationIdSetsRaw.nameToStationIdSetsMap)
                    );
                    return {
                        // id: stationIdSetsRaw.id,
                        username: stationIdSetsRaw.username,
                        nameToStationIdSetsMap: mapObject
                    };
                })
            );
    }
    getStationIdSets(username: string): Observable<StationIdSets | null> {
        return this.httpClient
            .get<any>(`${this.serviceUrl}/protected/data-rest/stationIdSetses/search/findByUsername?username=${username}`)
            .pipe(
                map(response => {
                    if (response._embedded.stationIdSetses.length === 1) {
                        const stationIdSetsRaw: StationIdSetsRaw = response._embedded.stationIdSetses[0]
                        console.log('stationIdSetsRaw', stationIdSetsRaw)
                        const mapObject = new Map<string, AirportIdentfierName[]>(
                            Object.entries(stationIdSetsRaw.nameToStationIdSetsMap)
                        );

                        return {
                            // id: stationIdSetsRaw.id,
                            username: stationIdSetsRaw.username,
                            nameToStationIdSetsMap: mapObject,
                            _links: stationIdSetsRaw._links
                        }
                    } else {
                        return null
                    }
                })
            );
    }

    addStationIdSets(stationIdSets: StationIdSets): Observable<any> {
        const rawMap: { [key: string]: AirportIdentfierName[] } = {};
        stationIdSets.nameToStationIdSetsMap.forEach((value, key) => {
            rawMap[key] = value;
        });
        const stationIdSetsRaw: StationIdSetsRaw = {
            username: stationIdSets.username,
            nameToStationIdSetsMap: rawMap
        }
        return this.httpClient.post(`${this.serviceUrl}/protected/data-rest/stationIdSetses`, stationIdSetsRaw)
    }
    updateStationIdSets(stationIdSets: StationIdSets): Observable<HttpResponse<any>> {
        const rawMap: { [key: string]: AirportIdentfierName[] } = {};
        stationIdSets.nameToStationIdSetsMap.forEach((value, key) => {
            rawMap[key] = value;
        });
        const stationIdSetsRaw: StationIdSetsRaw = {
            username: stationIdSets.username,
            nameToStationIdSetsMap: rawMap
        }
        return this.httpClient.put<HttpResponse<any>>(stationIdSets._links?.self.href.toString()!, stationIdSetsRaw);
    }
    deleteStationIdSets(url: URL): Observable<HttpResponse<any>> {
        return this.httpClient.delete<HttpResponse<any>>(url.toString());
    }
}
