import {Component, OnInit} from "@angular/core";
import {ListService} from "../../shared/list.service";
import {Router} from "@angular/router-deprecated";

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
     this._listService.load().forEach(document => {
          this.people.unshift(document);
     });
  }

  create(){
      this.router.navigate(['Create']);
  }
}
