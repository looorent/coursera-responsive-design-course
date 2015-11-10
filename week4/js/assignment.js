Array.prototype.flatMap = function(lambda) {
	return Array.prototype.concat.apply([], this.map(lambda));
};

Handlebars.registerHelper('everyNth', function(context, every, options) {
	var fn = options.fn, inverse = options.inverse;
	var ret = "";
	if(context && context.length > 0) {
		for(var i=0, j=context.length; i<j; i++) {
			var modZero = i % every === 0;
			ret = ret + fn(_.extend({}, context[i], {
				isModZero: modZero,
				isModZeroNotFirst: modZero && i > 0,
				isLast: i === context.length - 1
			}));
		}
	} else {
		ret = inverse(this);
	}
	return ret;
});


var allAnimals = animals.class.flatMap(function (reign) {
	return reign.animals;
}).
sort(function(animal1, animal2){
	if(animal1.name < animal2.name) return -1;
	if(animal1.name > animal2.name) return 1;
	return 0;

});

var routingService = {

	currentPage : {},

	availablePages :  [{
		name : "byClass",
		title : "Animals by class",
		templateName : "animalsByClass"
	},

	{
		name : "allAnimals",
		title : "All animals",
		templateName : "allAnimals"
	}],

	isActive : function(page) {
		return page.name == this.currentPage.name;
	},

	findPageBy : function(name) {
		return this.availablePages.filter(function(page) {
			return page.name == name;
		})[0];
	}
}

var templateService = {
	compilePage : function() {
		this.resolveTemplate(routingService.currentPage, function(source) {
			var template = Handlebars.compile(source);
			var data = {
				animals : animals,
				allAnimals : allAnimals,
				page: routingService.currentPage
			};
			$("#content").html(template(data));
		}
	);

},

changePageTo : function(pageName) {
	routingService.currentPage = routingService.findPageBy(pageName);
	this.updateMenu(routingService.availablePages);
	this.compilePage();
	$(document).prop('title', routingService.currentPage.title);
},

updateMenu : function(availablePages) {
	var menuContent = availablePages.map(function(page) {
		var active = routingService.isActive(page) ? 'class="active"' : '';
		var onclick = "templateService.changePageTo('"+page.name+"')";
		return  '<li '+active+' onclick="'+onclick+'"><a href="#">'+page.title+'</a></li>';
	}).join('');

	$("#menu").html(menuContent);
},

resolveTemplate : function(page, whatToDoWithTemplate) {
	return whatToDoWithTemplate($('#template_'+page.templateName).html());
}
}

$(document).ready(function() {
	templateService.changePageTo("byClass");
});
