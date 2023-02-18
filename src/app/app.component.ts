import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  ignoreElements,
  map,
  merge,
  of,
  share,
  startWith,
  switchMap,
  tap
} from "rxjs";
import { MockApiService } from "./shared/apis/mock.api.service";
import { User } from "./shared/models/user.model";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ButtonModule, CardModule, CommonModule, TableModule, ToastModule],
  providers: [MessageService],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  protected readonly reset$$ = new Subject<void>();

  private readonly error$$ = new Subject<Error>();

  private readonly onError$ = this.error$$.pipe(
    tap((err) => {
      console.error(err);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occured, try again"
      });
    }),
    ignoreElements()
  );

  private readonly resettedUsers$: Observable<User[]> = this.reset$$.pipe(
    map(() => []),
    startWith([])
  );

  private readonly fetchedUsers$ = merge(of(void 0), this.reset$$).pipe(
    switchMap(() =>
      this.mockApiService.findUsers().pipe(
        catchError((err) => {
          this.error$$.next(err); // nexted for the example only
          return of([]);
        })
      )
    ),
    share()
  );

  private readonly users$ = merge(this.resettedUsers$, this.fetchedUsers$);

  private readonly loading$ = merge(
    this.resettedUsers$.pipe(map(() => true)),
    this.fetchedUsers$.pipe(map(() => false))
  );

  protected readonly vm$ = combineLatest({
    users: this.users$,
    loading: this.loading$
  });

  constructor(private readonly mockApiService: MockApiService, private readonly messageService: MessageService) {
    this.onError$.subscribe();
  }
}
