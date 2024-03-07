import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Employee } from '../../models/employee';
import '../../loader/loaderExtensions'
import { ApexChart, ApexLegend, ApexNonAxisChartSeries } from 'ng-apexcharts';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit{
  searchCtrl = new FormControl();

  displayedColumns: string[] = ['employeeName', 'totalTime', 'actions'];
  dataSource = new MatTableDataSource<Employee>();

  private _loading = new BehaviorSubject(false);
  readonly loading = this._loading.asObservable();

  itemsPerPageLabel = "";
  @ViewChild('search') searchRef: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private _employeeService: EmployeeService){
  }

  ngOnInit(): void {
    this.itemsPerPageLabel = 'Items per page';

    this.getData();

    this.searchCtrl.valueChanges.pipe(debounceTime(500)).subscribe(value => this.onFilterChange(value));

    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter.toLowerCase());
    };
  }

  getData(){
    this._employeeService.GetAllTimeEntries().WithLoader(this._loading).subscribe({
      next: res => {
        this.dataSource.data = res.sort((a, b) => b.totalTime - a.totalTime);
      },
      error: err => {
        this.dataSource.data = [];
        alert(err)
      }
    })
  }

  refresh() {
    this.getData();
  }

  ngAfterViewInit() {
    this.itemsPerPageLabel = this.itemsPerPageLabel
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }
}