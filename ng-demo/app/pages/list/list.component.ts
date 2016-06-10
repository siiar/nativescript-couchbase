import {Component, OnInit} from "@angular/core";
import {ListService} from "../../shared/list.service";
import {Router, RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, ComponentInstruction} from '@angular/router-deprecated';
import {Location} from "@angular/common";
import {ObservableArray} from 'data/observable-array';


@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  providers: [ListService]
})

export class ListComponent implements OnInit {
  router: Router;
  service: ListService;

  get people(): any {
      return this.service.people;
  }

  constructor(router: Router, location: Location, private _listService: ListService) {
      this.router = router
      this.service = _listService;
      location.subscribe((path) => {
         this.refresh();
      });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(){
    this.service.load();
  }

  create(){
      this.router.navigate(['Create']);
  }
}
