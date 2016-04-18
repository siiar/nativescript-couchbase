import {CreateDemo} from "./create-view-model";

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = new CreateDemo(page);
}
exports.pageLoaded = pageLoaded;