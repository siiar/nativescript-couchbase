import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {CouchbaseInstance} from "../../couchbaseinstance";

@Component({
    selector: "my-app",
    templateUrl: "components/list/list.component.html",
})
export class ListComponent {

    private database: any;
    private router: Router;
    public personList: Array<Object>;

    constructor(router: Router, location: Location, couchbaseInstance: CouchbaseInstance) {
        this.router = router;
        this.database = couchbaseInstance.getDatabase();
        this.personList = [];

        couchbaseInstance.startSync(true);

        this.database.addDatabaseChangeListener((changes) => {
            var changeIndex;
            for (var i = 0; i < changes.length; i++) {
                var documentId;

                documentId = changes[i].getDocumentId();
                changeIndex = this.indexOfObjectId(documentId, this.personList);
                var document = this.database.getDocument(documentId);

                if (changeIndex == -1) {
                    this.personList.push(document);
                } else {
                    this.personList[changeIndex] = document;
                }
            }
        });

        location.subscribe((path) => {
            this.refresh();
        });

        this.refresh();
    }

    create() {
        this.router.navigate(["/create"]);
    }

    private refresh() {
        this.personList = [];
        let rows = this.database.executeQuery("people");
        for(let i = 0; i < rows.length; i++) {
            this.personList.push(rows[i]);
        }
    }

    private indexOfObjectId(needle: string, haystack: any) {
        for (let i = 0; i < haystack.length; i++) {
            if (haystack[i] != undefined && haystack[i].hasOwnProperty("_id")) {
                if (haystack[i]._id == needle) {
                    return i;
                }
            }
        }
        return -1;
    }

}
