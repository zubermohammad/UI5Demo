/**
 * 
 */

angular.module('empDash')
.controller('EmployeeInfo', function($scope,employee ){
	$scope.employee = employee.data.d;
})