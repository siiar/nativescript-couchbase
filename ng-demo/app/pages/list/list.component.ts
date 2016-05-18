import {Component, OnInit} from "@angular/core";
import {ListService} from "../../shared/list.service";
import {Router, RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, ComponentInstruction} from '@angular/router-deprecated';

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  providers: [ListService]
})

export class ListComponent implements OnInit {
  people: Array<any> = [];
  router: Router;

  constructor(router: Router, private _listService: ListService) {
      this.router = router
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(){
    this._listService.load().forEach(document => {
         this.people.unshift(document);
    });
  }

  routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
      this.refresh();
  }

  create(){
      this.router.navigate(['Create']);
  }
}
