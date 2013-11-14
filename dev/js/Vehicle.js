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