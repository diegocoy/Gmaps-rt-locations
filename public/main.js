var app = angular.module('routesApp', []);

app.controller('mainCtrl', function($scope, $http) {
	
	$scope.lat;
	$scope.lng;
	$scope.marks= [];
	var map;
	/************************/

	

	var latlng = new google.maps.LatLng(4.651010,  -74.045130);
	var myOptions = {
		zoom: 0,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.DRIVING
	};

	map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);


	var draw_data = function(){

		console.log($scope.marks.length)
		for(i=0;i<$scope.marks.length;i++){
			//path.push(new google.maps.LatLng($scope.marks[i].lat,$scope.marks[i].lng));
			create_marker($scope.marks[i]);
			console.log('coord: ',$scope.marks[i]);
		}
		

		function create_marker(coords){
			var marker = new google.maps.Marker({
				position: coords,
				map: map,
				//title: 'Hello World!',
				icon: ''
			});
		}
			/************************/

		var lineSymbol = {
			path:  google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			strokeOpacity: 1,
			scale: 1.7,
			strokeColor: '#56809a',
		};

		/************************/

		var routePolyline = new google.maps.Polyline({
				path: $scope.marks,
			    geodesic: true,
			    strokeColor: '#6070f9',
			    strokeOpacity: 1,
			    strokeWeight: 3,
			    icons: [{
			      icon: lineSymbol,
			      offset: '100%',
			      repeat: '30px'
			    }]
		});

		routePolyline.setMap(map);
		//var path = poly.getPath();

	/************************/
	};

	/************************/

	/* |||||||||||||||||||| */

	/************************/
	$scope.getRoutes = function(){
		$http.get('/api/routes')
		.success(function(data) {
			$scope.dbData = data;
			for(coords in data){
				$scope.marks.push(new google.maps.LatLng(data[coords].lat, data[coords].lng));
					console.log($scope.marks);
			}

			draw_data()

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
	/************************/
	$scope.createRoute = function() {
		$http({
			url: '/api/routes',
			method: "POST",
			data: { "lat": $scope.lat.text, "lng": $scope.lng.text }
		})
		.then(function(data) {
			$scope.dbData = data.data;
			//call the create and draw method
			$scope.getRoutes();
		}, 
		function(data) { 
			console.log('Error: ' + data);
		})
	};

	/************************/
	$scope.deleteRoute = function(id) {
		$http.delete('/api/routes/' + id)
		.success(function(data) {
			$scope.dbData = data;
			$scope.getRoutes();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
	/************************/
	$scope.getRoutes();

});
