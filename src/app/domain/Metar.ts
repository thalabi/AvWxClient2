export interface Metar {
    stationId: string;
    observationTime: Date;
    rawText: string;
    windDirDegrees: number;
    windSpeedKt: number;
    windGustKt: number;
    visibilityStatuteMi: number;
    auto: string;
    wxString: string;
    skyCover1: string;
    cloudBaseFtAgl1: number;
    skyCover2: string;
    cloudBaseFtAgl2: number;
    skyCover3: string;
    cloudBaseFtAgl3: number;
    skyCover4: string;
    cloudBaseFtAgl4: number;
    vertVisFt: number;
}
