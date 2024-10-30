import {Injectable, Pipe, PipeTransform} from "@angular/core";


@Pipe({
  name: 'priceFormat',
})

@Injectable()
export class PriceFormatPipe implements PipeTransform{

  transform(value: any, ...args: any[]): any {
    if(value==undefined){
      return "";
    }
    else{
      if(args[0] && args[0]=='short'){
        if (value >= 1000000) {
          return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (value >= 1000) {
          return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        } else {
          return value;
        }
      } else {
        value += "";
        let tab = value.split('');
        let p = "";
        for (let i = tab.length; i > 0; i--) {
          if (i % 3 == 0) {
            p += " ";
          }
          p += tab[tab.length - i];
        }
        return p;
      }

    }
  }
}
