import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  standalone: false,
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class StatusComponent  {
 @Input() isEdit = false;
}
