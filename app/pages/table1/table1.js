var conf 			= require('../../varConf');
var frameModule 	= require('ui/frame');
var timerModule     = require("timer");

var ViewModel       = require("./table1-model");
var ClassModel      = new ViewModel();

var context, firstVal,
	keys = [1, 2, 4, 8, 16];

function shuffle(array) 
{
	var tmp, current, top = array.length;
	if(top) while(--top) {
    	current = Math.floor(Math.random() * (top + 1));
    	tmp = array[current];
    	array[current] = array[top];
    	array[top] = tmp;
  	}
  	return array;
}

function renderNumber(theIndex)
{
	var data = shuffle(theIndex), el = [], r=0, c=1, cls="iteml";
	var itemRand = data[Math.floor(Math.random()*data.length)];
	for (var i = 0; i < data.length; i++)
	{
		if(c == 5){ c=1; }
		if(data[i] == itemRand){ cls="active"; } else { cls="iteml"; }
		el.push({
			idx 	: i,
			row		: r,
			col 	: c,
			num 	: data[i],
			cls 	: cls
		});
		if(i == 3 || i == 7 || i == 11 || i == 15){ r++; }
		c++;
	}
	context.set("data", el);
	context.set("step", context.step);
	context.set("isLoading", false);
}

function commonProccess(exe=false)
{
	if(context.step < 5)
	{
		if(exe)
		{
			context.set("result", context.result+keys[context.idx]);
		}

		let idx = context.ofTables[Math.floor(Math.random()*context.ofTables.length)];
		let arrIdx = conf.tables[idx];

		context.set("idx", idx);
		renderNumber(arrIdx);

		context.ofTables.splice(context.ofTables.indexOf(idx), 1);
		context.set("ofTables", context.ofTables);

		context.set("step", context.step+1);
	}
	else
	{
		context.set("loadingText", "Wait is analyzing the results...");
		timerModule.setTimeout(function(){
			if(exe)
			{
				if(context.step == 5)
				{
					context.set("result", context.result+keys[context.idx]);
				}
			}
			context.set("showstep", false);
			context.set("showresult", true);
			context.set("reports", context.report);
			context.set("isLoading", false);
		}, 5000);
	}
}

exports.onloaded = function(args)
{
    var page = args.object;
    
    firstVal = page.navigationContext.firstVal;
    context = ClassModel;

    context.set("ofTables", [0,1,2,3,4]);
    context.set("step", 1);
    context.set("result", 0);
    context.set("showstep", true);
    context.set("showresult", false);
    context.set("report", []);
    context.set("isLoading", true);
    context.set("loadingText", "Loading...");

    timerModule.setTimeout(function(){
    	let arrIdx = conf.tables[firstVal];
    	context.set("idx", firstVal);
    	renderNumber(arrIdx);
    	context.ofTables.splice(context.ofTables.indexOf(firstVal), 1);
    }, conf.timeloader+1850);

    page.bindingContext = context;
};

exports.yes = function()
{
	context.report.push({
		row  : context.step-1,
		step : context.step,
		numb : true
	});

	context.set("isLoading", true);
	context.set("loadingText", "Push data...");
	timerModule.setTimeout(function(){
		commonProccess(true);
	}, conf.timeloader+850);
};

exports.no = function(){
	context.report.push({
		row  : context.step-1,
		step : context.step,
		numb : false
	});

	context.set("isLoading", true);
	context.set("loadingText", "Push data...");
	timerModule.setTimeout(function(){
		commonProccess(false);
	}, conf.timeloader+850);
};

exports.xreload = function() {
    frameModule.topmost().navigate("main-page");
};