import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';

@Component({
  imports: [MaterialModule],
  selector: 'app-help-text',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent {}
