import { Component, OnInit, Input, inject } from '@angular/core';
import { IconData } from '../icon-legend/icon-data';
import { TBOManager } from '../../bo/bo-manager';
import { MaterialModule } from '../material/material.module';

@Component({
  imports: [MaterialModule],
  selector: 'app-icon-bar-legend',
  templateUrl: './icon-bar-legend.component.html',
  styleUrls: ['./icon-bar-legend.component.scss'],
})
export class IconBarLegendComponent implements OnInit {
  @Input() caption = '';
  @Input() bar: IconData[] = [];

  public BOManager = inject(TBOManager);

  constructor() {}

  ngOnInit() {}
}
