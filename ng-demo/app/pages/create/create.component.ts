import {Component, OnInit} from "@angular/core";
import {CreateService} from "../../shared/create.service";
import {Location} from "@angular/common";

@Component({
  selector: "list",
  templateUrl: "pages/create/create.html",
  providers: [CreateService]
})

export class CreateComponent implements OnInit {
  location: Location;
  firstname: string;
  lastname: string;

  constructor(location: Location, private _service: CreateService) {
    this.location = location;
    this.firstname = "";
    this.lastname = "";
  }

  ngOnInit() {

  }

  save(){
    this.location.back();
  }
}
