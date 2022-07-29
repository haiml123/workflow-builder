import {Observable, ReplaySubject, takeUntil, UnaryFunction} from "rxjs";
import {ChangeDetectorRef, inject, ViewRef} from "@angular/core";

export function takeUntilDestroy$<T>(): UnaryFunction<Observable<T>, Observable<T>> {
  const viewRef = inject(ChangeDetectorRef) as ViewRef;
  const destroyer$ = new ReplaySubject<void>(1);

  viewRef.onDestroy(() => destroyer$.next())

  return (observable: Observable<T>) => observable.pipe(takeUntil(destroyer$));
}
