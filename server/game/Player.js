
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
		this.lines = 0;
		this.dropCounter = 0;

		this.isKilled = false;

		// LEvelfluff
		this.level = 0;
		this.dropInterval = 700

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
			level: this.level,
			lines: this.lines,
			isKilled: this.isKilled
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
		if (this.isKilled) {
			return;
		}

		this.y++;
		this.dropCounter = 0;
		if (this.isColliding()) {
			this.y--;
			this.mergeWithArena();
			this.reset();

			this.addScore(this.arena.clearFullRows())
			return true;
		}

		return false;
	}

	addScore(lines) {
		if (!lines || lines == NaN) {
			return;
		}
		const table = {
			1: 40,
			2: 100,
			3: 300,
			4: 1200,
		};

		this.lines += lines;
		this.score += (table[lines] * (this.level + 1));

		this.updateLevel();
	}

	updateLevel() {

		this.level = Math.floor(this.lines / 10);
		this.dropInterval = 700 - (this.level * 50);
		/*
				const levels = [
					{
						lines: 150,
						level: 8,
						dropInterval: 50,
					},
					{
						lines: 120,
						level: 7,
						dropInterval: 75,
					},
					{
						lines: 100,
						level: 6,
						dropInterval: 100,
					},
					{
						lines: 80,
						level: 5,
						dropInterval: 200,
					},
					{
						lines: 60,
						level: 4,
						dropInterval: 300,
					},
					{
						lines: 40,
						level: 3,
						dropInterval: 400,
					},
					{
						lines: 20,
						level: 2,
						dropInterval: 500,
					},
					{
						lines: 10,
						level: 1,
						dropInterval: 600,
					},
					{
						lines: 5,
						level: 0.5,
						dropInterval: 650,
					},
					{
						lines: 0,
						level: 0,
						dropInterval: 700,
					},
				];

				let set = false;

				levels.forEach(l => {
					if (this.lines >= l.lines && !set) {
						this.level = l.level;
						this.dropInterval = l.dropInterval;
						set = true;
					}
				});*/

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
		const [m, o] = [this.block.matrix, pos];

		for (let y = 0; y < m.length; ++y) {
			for (let x = 0; x < m[y].length; ++x) {
				if (
					m[y][x] !== 0 &&
					(this.arena.matrix[y + o.y] && this.arena.matrix[y + o.y][x + o.x]) !== 0
				) {
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

		// GAME OVER
		if (this.isColliding()) {
			this.gameOver();
			// this.arena.fill(12, 20, 0);
			// this.score = 0;
		}
	}

	gameOver() {
		this.isKilled = true;
	}

}
module.exports = Player

