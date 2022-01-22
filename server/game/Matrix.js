class Matrix {
	constructor() {
		this.matrix = [];

		this.blocks = {
			T: [
				[0, 0, 0],
				[1, 1, 1],
				[0, 1, 0]
			],
			O: [
				[2, 2],
				[2, 2]
			],
			L: [
				[0, 3, 0],
				[0, 3, 0],
				[0, 3, 3]
			],
			J: [
				[0, 4, 0],
				[0, 4, 0],
				[4, 4, 0]
			],
			I: [
				[0, 5, 0, 0],
				[0, 5, 0, 0],
				[0, 5, 0, 0],
				[0, 5, 0, 0]
			],
			S: [
				[0, 6, 6],
				[6, 6, 0],
				[0, 0, 0]
			],
			Z: [
				[7, 7, 0],
				[0, 7, 7],
				[0, 0, 0]
			]
		};

		this.next = [];
	}

	// Fill with one value
	fill(width, height, value) {
		const matrix = [];
		while (height--) {
			matrix.push(new Array(width).fill(value));
		}
		this.matrix = matrix;
	}

	// Load one or random block
	block(type = false) {
		let block = [];
		if (type) {
			block = this.blocks[type];
		} else {

			if (!this.next.length) {
				this.next = [this.randomBlock(), this.randomBlock(), this.randomBlock()];
			}

			block = this.next.shift();
			this.next.push(this.randomBlock());
		}

		this.matrix = block;
	}

	randomBlock() {
		const pieces = "ILJOTSZ";
		return this.blocks[pieces[(pieces.length * Math.random()) | 0]];
	}

	// rotate matrix
	rotate(dir) {
		for (let y = 0; y < this.matrix.length; ++y) {
			for (let x = 0; x < y; ++x) {
				[
					this.matrix[x][y],
					this.matrix[y][x]
				] = [
						this.matrix[y][x],
						this.matrix[x][y]
					];
			}
		}
		if (dir > 0) {
			this.matrix.forEach(row => row.reverse());
		} else {
			this.matrix.reverse();
		}
	}

	clearFullRows() {
		let rows = 0;
		outer: for (let y = this.matrix.length - 1; y > 0; --y) {
			for (let x = 0; x < this.matrix[y].length; ++x) {
				if (this.matrix[y][x] === 0) {
					continue outer;
				}
			}
			const row = this.matrix.splice(y, 1)[0].fill(0);
			this.matrix.unshift(row);
			++y;
			++rows;
		}
		return rows;
	}

}

module.exports = Matrix
