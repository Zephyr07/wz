import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss'],
})
export class RankComponent implements OnInit {
  @Input() rank:number;
  constructor() { }

  ngOnInit() {}

}
