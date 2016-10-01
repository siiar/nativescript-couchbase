import { Routes } from "@angular/router";
import { ListComponent } from "./components/list/list.component";
import { CreateComponent } from "./components/create/create.component";
 
export const appRoutes: Routes = [
    { path: '', component: ListComponent },
    { path: "create", component: CreateComponent }
];
 
export const appComponents: any = [
    ListComponent,
    CreateComponent
];