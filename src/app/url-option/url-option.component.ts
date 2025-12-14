import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, MaterialModule],
  selector: 'app-url-option',
  templateUrl: './url-option.component.html',
  styleUrls: ['./url-option.component.scss'],
})
export class UrlOptionComponent implements OnInit {
  private apiService = inject(ApiService);

  constructor() {}

  ngOnInit() {}

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
