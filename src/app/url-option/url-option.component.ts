import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-url-option',
  templateUrl: './url-option.component.html',
  styleUrls: ['./url-option.component.scss']
})
export class UrlOptionComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  get urlOption(): number {
    if (this.apiService.AspNet) {
      return 1;
    }
    return 0;
  }

  set urlOption(value: number) {
    if (value === 1) {
      this.apiService.AspNet = true;
    } else {
      this.apiService.AspNet = false;
    }
  }

}
