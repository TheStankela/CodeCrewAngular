import { Component, Input, OnInit } from '@angular/core';
import { asyncScheduler, combineLatest, Observable } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() observables: Observable<boolean>[];
  loaderObservable : any;

  private delay = 400;

  constructor() { }

  ngOnInit(): void {
    this.loaderObservable = combineLatest(this.observables)
    .pipe(
      throttleTime(this.delay, asyncScheduler, {leading: true, trailing: true}),
      map(res => res.some(x => x == true))
    );
  }
}
