import { Pipe, PipeTransform } from '@angular/core';
import { Platillo } from 'src/app/interfaces/menu-platillos.interface';

@Pipe({
  name: 'platilloImagen'
})
export class PlatilloImagenPipe implements PipeTransform {

  transform(platillo: Platillo): string {


    if(platillo.img === '' )
      return 'assets/images/no_image.png';

    return platillo.img;

  }

}
