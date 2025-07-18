import { AirportIdentfierName } from "./AirportIdentfierName"

export interface StationIdSetsRaw {
    id?: number
    username: string
    nameToStationIdSetsMap: { [key: string]: AirportIdentfierName[] }
    _links?: {
        self: {
            href: URL
        },
        stationIdSets: {
            href: URL
        }
    }
}
export interface StationIdSets {
    id?: number
    username: string
    nameToStationIdSetsMap: Map<string, AirportIdentfierName[]>
    _links?: {
        self: {
            href: URL
        },
        stationIdSets: {
            href: URL
        }
    }
}
// export function stationIdSetsFromRaw(raw: StationIdSetsRaw) {
//     return {
//         id: raw.id,
//         username: raw.username,
//         nameToStationIdSetsMap: new Map<string, AirportIdentfierName[]>(
//             Object.entries(raw.nameToStationIdSetsMap)
//         )
//     };
//}