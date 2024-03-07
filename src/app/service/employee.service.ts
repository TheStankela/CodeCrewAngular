import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../settings';
import { TimeEntry } from '../models/timeEntry';
import { Observable, map } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  readonly localUrl = Settings.ApiUrl;
  readonly code = Settings.Code;

  counter = 0;
  constructor(private http: HttpClient){
  }

  GetAllTimeEntries() : Observable<Employee[]> {
    return this.http.get<TimeEntry[]>(this.localUrl + `/getTimeEntries?code=${this.code}`)
    .pipe(
      map(timeEntries => {
        return this.mapToDisplayModel(timeEntries).filter(x => x.name != null);
      })
    )
  }

  private mapToDisplayModel(employees: TimeEntry[]): Employee[] {
    return employees.reduce((acc, curr) => {
      const existingEmployee = acc.find(emp => emp.name === curr.EmployeeName);
      if (existingEmployee) {
        existingEmployee.totalTime += this.calculateTimeDifference(
          curr.StarTimeUtc,
          curr.EndTimeUtc
        );
      } else {
        acc.push({
          name: curr.EmployeeName,
          totalTime: this.calculateTimeDifference(
            curr.StarTimeUtc,
            curr.EndTimeUtc
          )
        });
      }
      return acc;
    }, [])
    .map(employee => ({
      ...employee,
      totalTime: Math.round(employee.totalTime)
    }));
  }

  calculateTimeDifference(startTime: Date, endTime: Date): number {
    if(startTime < endTime){
      const timeDifference = parseDate(endTime).getTime() - parseDate(startTime).getTime();
      const hours = (timeDifference / (1000 * 60 * 60));
      return hours;
    }
    return 0;
  }
}

function parseDate(input: any) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4]); // months are 0-based
}