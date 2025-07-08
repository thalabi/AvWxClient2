import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'windDirection' })
export class WindDirectionPipe implements PipeTransform {
    transform(windDirDegrees: number): string {
        if (!windDirDegrees) {
            return 'VRB'
        }
        let windDirection: string = "" + windDirDegrees;
        while (windDirection.length < 3) windDirection = "0" + windDirection;
        return windDirection;
    }
}