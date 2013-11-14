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