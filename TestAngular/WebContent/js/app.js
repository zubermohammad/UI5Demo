var myApp = angular.module('empDash',['ui.router','oc.lazyLoad']);

myApp.service('employeeInfo', function($http, $q){
	
	return ({
		getEmployeeInfo: getEmployeeInfo,
	});
	
	function getUrl(url){
		if(location.hostname === 'localhost'){
			return 'proxy' + url;
		}else{
			return url;
		}
	}
	
	function getEmployeeInfo(){
		var url = getUrl("/sap/opu/odata/SAP/ZHCM_EMP_DASHBOARD_SRV/empdashboardSet('%20')?$format=json");
		var req = $http({
			method: 'GET',
			withCredentials: true,
        	headers: {
                    'Content-Type': 'application/json; charset=utf-8'
        	},
			url:url,
		});
		
		return ( req.then( handleSuccess, handleError));
		
	}
	
	function handleSuccess(response){
		return response;	
	}
	
	function handleError(response){
		return( $q.reject('Error occured'));
	}
});

myApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/dash");
  //
  // Now set up the states
  $stateProvider
    .state('dash', {
      url: "/dash",
      templateUrl: "templates/employeeInfo.html",
	  controller: 'EmployeeInfo',
	  resolve: {
		  lazyLoad:  ['$ocLazyLoad', function($ocLazyLoad) {
	             return $ocLazyLoad.load('js/app/controllers/DashboardController.js');
		    }],
		  employee :['lazyLoad', 'employeeInfo', function(lazyLoad,employeeInfo){
			  
			  return employeeInfo.getEmployeeInfo();
		  }]
	  }
    })
    .state('contactus', {
      url: "/contactus",
      templateUrl: "templates/contactus.html",
      controller:  "ContactusController",
      resolve: {
    	  loadContactusController : ['$ocLazyLoad', function($ocLazyLoad){
    		  return $ocLazyLoad.load('js/app/controllers/ContactusController.js');
    	  }],
      }
    })
    .state('state2', {
      url: "/state2",
      templateUrl: "partials/state2.html"
    })
    .state('state2.list', {
      url: "/list",
      templateUrl: "partials/state2.list.html",
      controller: function($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
      }
    });
});

//Define Controllers

myApp.controller('EmployeeInfo', function($scope,employee ){
	$scope.employee = employee.data.d;
})

