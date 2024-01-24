import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-oups-info',
  templateUrl: './oups-info.component.html',
  styleUrls: ['./oups-info.component.scss'],
})
export class OupsInfoComponent implements OnInit {
  @Input() text:string;
  constructor() { }

  ngOnInit() {}

}
