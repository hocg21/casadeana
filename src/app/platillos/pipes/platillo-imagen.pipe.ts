import {  Pipe, PipeTransform } from '@angular/core';
import { Platillo } from 'src/app/interfaces/menu-platillos.interface';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { finalize } from 'rxjs';

@Pipe({
  name: 'platilloImagen'
})
export class PlatilloImagenPipe implements PipeTransform {


  async transform(platillo: Platillo): Promise<any> {

    if(platillo.img === '' )
      return 'assets/images/no_image.png';

    const storage = getStorage();

    return getDownloadURL(ref(storage, platillo.img)).then((url)=>{
      return  url
    })

  }

}
