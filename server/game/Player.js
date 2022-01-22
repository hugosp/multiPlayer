
const Matrix = require('./Matrix');

class Player {
	constructor(socket, options) {
		this.id = socket.id;
		this.name = options.name || '';

		this.isHost = false;
		this.room = null;

		this.x = 0;
		this.y = 0;

		this.arena = new Matrix();
		this.block = new Matrix();

		this.score = 0;

		this.arena.fill(12, 20, 0);
	}

	// sanitize data emitted
	getData() {
		return {
			id: this.id,
			name: this.name,
			isHost: this.isHost,
			room: this.room,
			x: this.x,
			y: this.y,
			arena: this.arena.matrix,
			block: this.block.matrix,
			next: this.block.next,
			score: this.score,
		}
	}


	move(dir) {
		this.x += dir;
		if (this.isColliding()) {
			this.x -= dir;
		}
	}

	rotate(dir) {
		const pos = this.x;
		let offset = 1;

		this.block.rotate(dir);
		while (this.isColliding()) {
			this.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));
			if (offset > this.block.matrix[0].length) {
				this.block.rotate(-dir);
				this.x = pos;
				return;
			}
		}
	}

	drop() {
		this.y++;
		if (this.isColliding()) {
			this.y--;
			this.mergeWithArena();
			this.reset();
			this.score += this.arena.clearFullRows();
			return true;
		}

		return false;
	}

	hardDrop() {
		while (!this.isColliding()) {
			this.y++
		}
		this.y--
		return this.drop();
	}

	isColliding() {
		const pos = Object.assign({}, { x: this.x, y: this.y });
		console.log(pos)
		const [m, o] = [this.block.matrix, pos];
		for (let y = 0; y < m.length; ++y) {
			for (let x = 0; x < m[y].length; ++x) {
				if (
					m[y][x] !== 0 &&
					(this.arena.matrix[y + o.y] && this.arena.matrix[y + o.y][x + o.x]) !== 0
				) {
					console.log('CoLLiSOOM', { x, y, ox: o.x, oy: o.y })
					return true;
				}
			}
		}
		return false;
	}

	mergeWithArena() {
		this.block.matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					this.arena.matrix[y + this.y][x + this.x] = value;
				}
			});
		});
	}

	reset() {
		this.block.block();

		this.y = 0;
		this.x = ((this.arena.matrix[0].length / 2) | 0) - ((this.block.matrix[0].length / 2) | 0);

		if (this.isColliding()) {
			this.arena.fill(12, 20, 0);
			this.score = 0;
		}
	}

}
module.exports = Player

