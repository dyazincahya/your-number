var conf            = require("../../varConf");
var ObservableArray = require("data/observable-array").ObservableArray;

var page, context;

function Model(items) {
    var viewModel = new ObservableArray(items);

	viewModel.empty = function() {
	    while (viewModel.length) {
	        viewModel.pop();
	    }
	};

    return viewModel;
}

module.exports = Model;