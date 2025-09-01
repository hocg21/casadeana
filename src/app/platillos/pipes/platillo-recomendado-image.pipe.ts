import { Pipe, PipeTransform } from '@angular/core';
import { Platillo } from 'src/app/interfaces/menu-platillos.interface';

@Pipe({
    name: 'recomendadoImagen',
    standalone: true
})
export class PlatilloRecomendadoImagenPipe implements PipeTransform {

  transform(platillo: Platillo): string {

    if(platillo.recomendado === false)
      return 'assets/images/logo.png';

    return 'assets/images/nutri.png';

  }

}
