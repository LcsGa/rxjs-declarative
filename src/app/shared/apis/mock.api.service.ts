import { Injectable } from "@angular/core";
import { Observable, delay, identity, of, pipe, tap } from "rxjs";
import { User, UsersSchema } from "../models/user.model";
import { generateMock } from "@anatine/zod-mock";

@Injectable({ providedIn: "root" })
export class MockApiService {
  public findUsers(): Observable<User[]> {
    return of(generateMock(UsersSchema)).pipe(
      delay(Math.round(Math.random() * 500 + 500)),
      Math.random() < 0.3
        ? pipe(
            tap(() => {
              throw new Error();
            })
          )
        : identity
    );
  }
}
