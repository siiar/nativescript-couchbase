import {Component, OnInit} from "@angular/core";
import {ListService} from "../../shared/list.service";


@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  providers: [ListService]
})

export class ListPage implements OnInit {
  people: Array<any> = [];

  constructor(private _listService: ListService) {}

  ngOnInit() {
    this._listService.load()
  }

  create(){

  }
}
