import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value && value == true) {
      return "Activo";
    }
    console.log(value)
    return "inactivo";
  }

}
