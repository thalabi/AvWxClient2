import { Pipe, PipeTransform } from '@angular/core';
import { Metar } from '../domain/Metar';


@Pipe({ name: 'skyCondition' })
export class SkyConditionPipe implements PipeTransform {
    readonly SPACE: string = " ";
    transform(metar: Metar): string {
        let skyCondition: string;
        if (metar.vertVisFt || metar.skyCover1 == 'OVX') {
            skyCondition = "VV" + metar.vertVisFt;
        } else {
            if (metar.skyCover1 == "CLR") {
                skyCondition = metar.skyCover1;
            } else {
                skyCondition = metar.skyCover1 + this.formatCloadBase(metar.cloudBaseFtAgl1);
            }
        }
        if (metar.cloudBaseFtAgl2) {
            skyCondition += this.SPACE + metar.skyCover2 + this.formatCloadBase(metar.cloudBaseFtAgl2);
        }
        if (metar.cloudBaseFtAgl3) {
            skyCondition += this.SPACE + metar.skyCover3 + this.formatCloadBase(metar.cloudBaseFtAgl3);
        }
        if (metar.cloudBaseFtAgl4) {
            skyCondition += this.SPACE + metar.skyCover4 + this.formatCloadBase(metar.cloudBaseFtAgl4);
        }
        return skyCondition;
    }

    private formatCloadBase(cloudBaseFtAgl1: number): string {
        let cloadBase: string = "" + cloudBaseFtAgl1 / 100;
        while (cloadBase.length < 3) cloadBase = "0" + cloadBase;
        return cloadBase;
    }
}