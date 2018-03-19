var frameModule = require('ui/frame');

exports.onNavigatingTo = function(args) {
    var page = args.object;
};

exports.table1 = function() {
	var ot = [0,1,2,3,4],
		randOt = ot[Math.floor(Math.random()*ot.length)];

    frameModule.topmost().navigate({
    	moduleName : "pages/table1/table1",
    	context : { firstVal : randOt }
    });
};