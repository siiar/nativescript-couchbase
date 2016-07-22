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
  service: CreateService;

  firstname: string;
  lastname: string;

  constructor(location: Location, service: CreateService) {
    this.location = location;
    this.service = service;

    this.firstname = "";
    this.lastname = "";
  }

  ngOnInit() {

  }  

  save(){
    this.service.save({
      firstname : this.firstname,
      lastname : this.lastname
    });
    this.location.back();
  }
}
