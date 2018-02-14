app
.directive('adminDirective', function() {
    return function(scope, element, attributes) {
        var cells = element.find("td");
        for (var i=0; i<cells.length; i++) {
            cells.eq(i).css('background-color', 'red');alert(i);
        }
        
    }
});