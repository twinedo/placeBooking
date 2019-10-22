import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  // tslint:disable-next-line: variable-name
  private _places: Place[] = [
    new Place(
      'p1',
      'Monas',
      'In the heart of Central Jakarta.',
      'https://i1.wp.com/www.gulalives.co/wp-content/uploads/2016/08/monumen-nasional-3500-7.jpg?resize=696%2C522&ssl=1',
      150.000
    ),
    new Place(
      'p2',
      'Museum Fatahillah',
      'West Jakarta.',
      // tslint:disable-next-line: max-line-length
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Jakarta_Indonesia_Jakarta-History-Museum-02.jpg/800px-Jakarta_Indonesia_Jakarta-History-Museum-02.jpg',
      150.000
    ),
    new Place(
      'p3',
      'Taman Mini Indonesia Indah',
      'East Jakarta.',
      // tslint:disable-next-line: max-line-length
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Indonesia_in_miniature%2C_Taman_Mini_Indonesia_Indah.jpg/800px-Indonesia_in_miniature%2C_Taman_Mini_Indonesia_Indah.jpg',
      100.000
    )
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}
