import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'remark' })
export class RemarkPipe implements PipeTransform {
    transform(metarText: string): string {
        let pattern: RegExp = new RegExp('(RMK.*)');
        let rea: RegExpExecArray | null = pattern.exec(metarText);
        if (rea) {
            return rea[0];
        } else {
            return "";
        }
    }
}