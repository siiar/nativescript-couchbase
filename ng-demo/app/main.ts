// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {CouchbaseInstance} from "./couchbaseinstance";

nativeScriptBootstrap(AppComponent, [CouchbaseInstance], { startPageActionBarHidden: false });
