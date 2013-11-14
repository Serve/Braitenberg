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
var Lamp = function () {
	var self = this;

	this._position = { x: 0, y: 0 };
	this._color = { r: 255, g: 255, b: 255, a: 1 };
	this._angle = Math.random() * Math.PI * 2; 
	this._speed = Math.random();
	this._radius = 10;

	this.draw = function (context) {
		context.beginPath();
		context.arc(self._position.x, self._position.y, this._radius, 0, Math.PI*2, true);
		context.closePath();
		
		context.lineWidth = 2;
		context.strokeStyle = "rgba("+this._color.r+", "+this._color.g+", "+this._color.b+", 0.3)";
		context.stroke();
	}

	this.update = function () {
		// Update position
		self._position.x += Math.cos(self._angle) * this._speed;
		self._position.y += Math.sin(self._angle) * this._speed;

		// Check boundaries
		if (self._position.x > window.innerWidth) self._position.x = 0;
		if (self._position.y > window.innerHeight) self._position.y = 0;
		if (self._position.x < 0) self._position.x = window.innerWidth;
		if (self._position.y < 0) self._position.y = window.innerHeight;
	}
}
var Motor = function () {
	var self = this;

	this._position = { x: 0, y: 0 };
	this._speed = 0;
	this._radius = 5; // Vehicle axle / 2
	this._acceleration = 0;
	this._differential = 0;

	this.update = function () {
		self._speed += self._acceleration;
		self._speed *= 0.96;
	}

	this.setSpeed = function (acceleration) {
		self._acceleration = acceleration;
		self._differential = self._speed * self._radius;
	}
}
var Sensor = function (range, color) {
	var self = this;

	this._range = range;
	this._color = color;
	this._position = { x: 0, y: 0 };

	this.getSense = function (lamps) {
		var sense = 0
		for (var i = 0; i < lamps.length; i++) {
			var dist = distance(self._position.x, self._position.y, lamps[i]._position.x, lamps[i]._position.y);
			if (dist < self._range || self._range == 0) {
				sense += 1 / dist;
			}
		}
		return sense;
	}

	this.draw = function (context, lamps, draw_sense_lines) {
		// Draw sensor to lamp lines
		if (draw_sense_lines) {
			for (var i = 0; i < lamps.length; i++) {
				var dist = distance(self._position.x, self._position.y, lamps[i]._position.x, lamps[i]._position.y);
				if (dist < self._range || self._range == 0) {
					context.beginPath();
					context.moveTo(self._position.x, self._position.y);
					context.lineTo(lamps[i]._position.x, lamps[i]._position.y);
					
					var alpha =  1 - (dist / self._range);
					var lin_grad = context.createLinearGradient(self._position.x, self._position.y, lamps[i]._position.x, lamps[i]._position.y);
					
					lin_grad.addColorStop(0, 'rgba('+ self._color.r + ',' + self._color.g + ','+ self._color.b + ','+ alpha.toFixed(3) +')');
					lin_grad.addColorStop(1, 'rgba(255, 255, 255, 0');
						
					context.lineWidth = 1;	
					context.strokeStyle = lin_grad;
					context.stroke();	
				}
			}
		}
		// Draw sensor
		context.beginPath();
		context.arc(self._position.x, self._position.y, 1, 0, Math.PI*2, true);
		context.closePath();
		context.fillStyle = 'rgba('+ self._color.r + ',' + self._color.g + ','+ self._color.b + ', 1)';
		context.fill();
	}
}
var Vehicle = function () {
	var self = this;

	this._position = { x: 0, y: 0 };
	this._angle = Math.random() * Math.PI * 2;
	this._type = (Math.random() < 0.5) ? 0 : 1; // 0. Coward, 1. Aggressive
	this._axle = 10;
	this._range = Math.floor(Math.random() * (window.innerWidth/2 - 100 + 1)) + 100; // Sensitivity range in px (max: width/2, min: 100). Range: 0 = off.
	this._color = (this._type == 0) ? { r: 0, g: 63, b: 104, a: 1 } : { r: 221, g: 100, b: 136, a: 1 };
	this._sensors = [];
	this._motors = [];

	this.draw = function (context) {
		context.beginPath();
		context.fillStyle = "rgba("+this._color.r+", "+this._color.g+", "+this._color.b+", "+this._color.a+")";
		context.arc(self._position.x, self._position.y, 3, 0, Math.PI*2, true);
		context.closePath();
		context.fill();
	}

	this.init = function () {
		self._sensors.push(new Sensor(self._range, self._color));
		self._sensors.push(new Sensor(self._range, self._color));
		self._motors.push(new Motor());
		self._motors.push(new Motor());
	}

	this.update = function (lamps) {
		// Update sensor position
		self._sensors[0]._position.x = 0.5 * self._axle * Math.cos(self._angle - (Math.PI / 2)) + self._position.x;
		self._sensors[0]._position.y = 0.5 * self._axle * Math.sin(self._angle - (Math.PI / 2)) + self._position.y;
		self._sensors[1]._position.x = 0.5 * self._axle * Math.cos(self._angle + (Math.PI / 2)) + self._position.x;
		self._sensors[1]._position.y = 0.5 * self._axle * Math.sin(self._angle + (Math.PI / 2)) + self._position.y;

		// Update motor speed with sense values
		if (self._type == 0) {
			self._motors[0].setSpeed(self._sensors[0].getSense(lamps));
			self._motors[1].setSpeed(self._sensors[1].getSense(lamps));	
		} else {
			self._motors[0].setSpeed(self._sensors[1].getSense(lamps));
			self._motors[1].setSpeed(self._sensors[0].getSense(lamps));	
		}
		
		// Check boundaries
		if (self._position.x > window.innerWidth) self._position.x = 0;
		if (self._position.y > window.innerHeight) self._position.y = 0;
		if (self._position.x < 0) self._position.x = window.innerWidth;
		if (self._position.y < 0) self._position.y = window.innerHeight;

		// Update vehicle position
		var motor_difference = self._motors[0]._differential - self._motors[1]._differential;
		var motor_average = (self._motors[0]._differential + self._motors[1]._differential) / 2;
		
		self._angle += motor_difference / self._axle;
		self._position.x += Math.cos(self._angle) * motor_average;
		self._position.y += Math.sin(self._angle) * motor_average;

		// Update motors position
		var motor_angle = self._angle - (Math.PI / 2);

		self._motors[0]._position.x = self._position.x + 0.5 * self._axle * Math.cos(motor_angle);
		self._motors[0]._position.y = self._position.y + 0.5 * self._axle * Math.sin(motor_angle);

		motor_angle = self._angle + (Math.PI / 2);

		self._motors[1]._position.x = self._position.x + 0.5 * self._axle * Math.cos(motor_angle);
		self._motors[1]._position.y = self._position.y + 0.5 * self._axle * Math.sin(motor_angle);

		self._motors[0].update();
		self._motors[1].update();
	}
}

Vehicle.prototype = {
	set position(value) {
		this._position = value;
	},
	get position() {
		return this._position;
	}
}

