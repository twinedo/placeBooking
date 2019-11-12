import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// new Place(
//   'p1',
//   'Monas',
//   'In the heart of Central Jakarta.',
//   'https://i1.wp.com/www.gulalives.co/wp-content/uploads/2016/08/monumen-nasional-3500-7.jpg?resize=696%2C522&ssl=1',
//   150.000,
//   new Date('2019-01-01'),
//   new Date('2019-12-31'),
//   'abc'
// ),
// new Place(
//   'p2',
//   'Museum Fatahillah',
//   'West Jakarta.',
//   // tslint:disable-next-line: max-line-length
//   'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Jakarta_Indonesia_Jakarta-History-Museum-02.jpg/800px-Jakarta_Indonesia_Jakarta-History-Museum-02.jpg',
//   150.000,
//   new Date('2019-01-01'),
//   new Date('2019-12-31'),
//   'abc'
// ),
// new Place(
//   'p3',
//   'Taman Mini Indonesia Indah',
//   'East Jakarta.',
//   // tslint:disable-next-line: max-line-length
//   'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Indonesia_in_miniature%2C_Taman_Mini_Indonesia_Indah.jpg/800px-Indonesia_in_miniature%2C_Taman_Mini_Indonesia_Indah.jpg',
//   100.000,
//   new Date('2019-01-01'),
//   new Date('2019-12-31'),
//   'abc'
// )

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  // tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([]) ;

  get places() {
    // return [...this._places];
    return this._places.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  fetchPlaces() {
    return this.http.get<{[key: string]: PlaceData}>(
      'https://ionic-angular-course.firebaseio.com/offered-places.json')
    .pipe(map(resData => {
      const places = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          places.push(new Place(
            key,
            resData[key].title,
            resData[key].description,
            resData[key].imageUrl,
            resData[key].price,
            new Date(resData[key].availableFrom),
            new Date(resData[key].availableTo),
            resData[key].userId
          ));
        }
      }
      return places;
      // return [];

    }),
    tap(places => {
      this._places.next(places);
    })
    );
  }

  getPlace(placeId: string) {
    return this.http.get<PlaceData>(`https://ezplore-id.firebaseio.com/offered-places/${placeId}.json`)
    .pipe(
      map(placeData => {
      return new Place
      (
        placeId,
        placeData.title,
        placeData.description,
        placeData.imageUrl,
        placeData.price,
        new Date(placeData.availableFrom),
        new Date(placeData.availableTo),
        placeData.userId);
    }));
  }



  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://i1.wp.com/www.gulalives.co/wp-content/uploads/2016/08/monumen-nasional-3500-7.jpg?resize=696%2C522&ssl=1',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
      );

    return this.http.post<{name: string}>('https://ezplore-id.firebaseio.com/offered-places.json',
    { ...newPlace, id: null })
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );

    // this._places.push(newPlace);
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    // }));
  }

  updatePlace(
    placeId: string,
    title: string,
    description: string
  ) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
          );
        return this.http.put(
         `https://ezplore-id.firebaseio.com/offered-places/${placeId}.json`,
         {...updatedPlaces[updatedPlaceIndex], id: null}
       );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
