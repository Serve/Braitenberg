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