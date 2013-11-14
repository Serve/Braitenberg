// requestAnim shim layer by Paul Irish
window.requestAnimFrame = ( function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Helper functions
distance = function (x0, y0, x1, y1) {
	var distX = x1 - x0;
	var distY = y1 - y0;
	return Math.sqrt((distX * distX) + (distY * distY));;
}

// Braitenberg
var Braitenberg = function (canvasId) {
	var self = this;

	this.show_trails = false;
	this.show_sensors = false;
	this.show_sensor_lines = false;

	this.lamps = [];
	this.vehicles = [];

	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");

	// Initializes Braitenberg environment
	this.init = function () {
		self.render();
	}

	// Render Braitenberg environment
	this.render = function () {
		if (!self.show_trails) {
			self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
			self.context.fillStyle = "rgba(0, 0, 0, 1)";
			self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);	
		} else {
			self.context.fillStyle = "rgba(0, 0, 0, 0.1)";
			self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);	
		}

		for (var i = 0; i < self.vehicles.length; i++) {
			self.vehicles[i].update(self.lamps);
			self.vehicles[i].draw(self.context);
			if (self.show_sensors) {
				if (self.show_sensor_lines) {
					self.vehicles[i]._sensors[0].draw(self.context, self.lamps, true);
					self.vehicles[i]._sensors[1].draw(self.context, self.lamps, true);
				} else {
					self.vehicles[i]._sensors[0].draw(self.context, self.lamps, false);
					self.vehicles[i]._sensors[1].draw(self.context, self.lamps, false);
				}
			}
		}

		for (var i = 0; i < self.lamps.length; i++) {
			self.lamps[i].update();
			self.lamps[i].draw(self.context);
		}
		
		requestAnimFrame(self.render);
	}

	this.addVehicle = function () {
		var vehicle = new Vehicle;
		vehicle.init();
		vehicle._position.x = Math.floor(Math.random()*window.innerWidth);
		vehicle._position.y = Math.floor(Math.random()*window.innerHeight);
		self.vehicles.push(vehicle);
	}

	this.addLamp = function () {
		var lamp = new Lamp();
		lamp._position.x = Math.floor(Math.random()*window.innerWidth);
		lamp._position.y = Math.floor(Math.random()*window.innerHeight);
		self.lamps.push(lamp);	
	}
}