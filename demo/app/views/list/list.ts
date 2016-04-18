import {ListDemo} from "./list-view-model";

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = new ListDemo();
}
exports.pageLoaded = pageLoaded;