import {Injectable} from "@angular/core";
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';

@Injectable()
export class CreateService {
    public people = new ObservableArray([])
    private database: any;

    constructor(){
        
    }
}
