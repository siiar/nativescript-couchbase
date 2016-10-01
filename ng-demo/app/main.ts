// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { appRoutes, appComponents } from "./app.routing";
import { AppComponent } from "./app.component";
import { CouchbaseInstance } from "./couchbaseinstance";

@NgModule({
    declarations: [AppComponent, ...appComponents],
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule, 
        NativeScriptRouterModule.forRoot(appRoutes)
    ],
    providers: [CouchbaseInstance]
})
class AppComponentModule {}

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);