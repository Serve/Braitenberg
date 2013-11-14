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