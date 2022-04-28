class Cell {
    static TOP = 0;
    static RIGHT = 1;
    static BOTTOM = 2;
    static LEFT = 3;

    constructor(options) {
        this.isCollapsed = false;
        this.options = options;
        this.x = 0;
        this.y = 0;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
    }

    setOptions(cellOptions) {
        if (this.options.length > 1 && !this.isCollapsed && cellOptions.length > 0) {
            this.options = cellOptions;
        }
    }

    collapse() {
        if (this.options.length === 1) { this.isCollapsed = true; }
    }

    checkValid(arr, valid) {
        for (let i = arr.length - 1; i >= 0; i--) {
            let element = arr[i];
            if (!valid.includes(element)) {
                arr.splice(i, 1);
            }
        }
    }

    async checkLeft(grid, islandMode, tiles) {
        const currentOptions = this.options;
        //const options = tiles.map(x => x.index);

        return new Promise((resolve) => {
            let selection = this.left; //grid.find(item => item.x == this.x - 1 && item.y === this.y);
            if (!selection && islandMode) { selection = new Cell([0]); }

            if (selection) {
                let newOptions = selection.options.reduce((prev, cur) => {
                    // const node = tiles[cur].nodes[Cell.RIGHT];
                    //const availableTiles = tiles.filter(x => Tile.compare(x, Cell.LEFT, node)).map(x => x.index);
                    const node = tiles[cur];
                    const availableTiles = node.right;
                    for (let i = 0; i < availableTiles.length; i++) {
                        if (!prev.includes(availableTiles[i])) { prev.push(availableTiles[i]); }
                    }
                    return prev;
                }, []);
                resolve(newOptions);
                // let validOptions = [];
                // for (let option of selection.options) {
                //     let valid = tiles[option].right;
                //     validOptions = validOptions.concat(valid);
                // }
                // this.checkValid(options, validOptions);
                // resolve(validOptions);
            }
            else {
                resolve(currentOptions);
            }
        });
    }

    async checkRight(grid, islandMode, tiles) {
        const currentOptions = this.options;
        //const options = tiles.map(x => x.index);

        return new Promise((resolve) => {
            let selection = this.right; //grid.find(item => item.x == this.x + 1 && item.y === this.y);
            if (!selection && islandMode) { selection = new Cell([0]); }

            if (selection) {
                let newOptions = selection.options.reduce((prev, cur) => {
                    if (!tiles[cur]) {
                        console.log(Cell.LEFT, cur, tiles);
                    }
                    // const node = tiles[cur].nodes[Cell.RIGHT];
                    //const availableTiles = tiles.filter(x => Tile.compare(x, Cell.LEFT, node)).map(x => x.index);
                    const node = tiles[cur];
                    const availableTiles = node.left;
                    for (let i = 0; i < availableTiles.length; i++) {
                        if (!prev.includes(availableTiles[i])) { prev.push(availableTiles[i]); }
                    }
                    return prev;
                }, []);
                resolve(newOptions);
                // let validOptions = [];
                // for (let option of selection.options) {
                //     let valid = tiles[option].left;
                //     validOptions = validOptions.concat(valid);
                // }
                // this.checkValid(options, validOptions);
                // resolve(validOptions);
            }
            else {
                resolve(currentOptions);
            }
        });
    }

    async checkTop(grid, islandMode, tiles) {
        const currentOptions = this.options;
        //const options = tiles.map(x => x.index);

        return new Promise((resolve) => {
            let selection = this.up; //grid.find(item => item.x === this.x && item.y == this.y - 1);
            if (!selection && islandMode) { selection = new Cell([0]); }

            if (selection) {
                let newOptions = selection.options.reduce((prev, cur) => {
                    // const node = tiles[cur].nodes[Cell.RIGHT];
                    //const availableTiles = tiles.filter(x => Tile.compare(x, Cell.LEFT, node)).map(x => x.index);
                    const node = tiles[cur];
                    const availableTiles = node.down;
                    for (let i = 0; i < availableTiles.length; i++) {
                        if (!prev.includes(availableTiles[i])) { prev.push(availableTiles[i]); }
                    }
                    return prev;
                }, []);
                resolve(newOptions);
                // let validOptions = [];
                // for (let option of selection.options) {
                //     let valid = tiles[option].down;
                //     validOptions = validOptions.concat(valid);
                // }
                // this.checkValid(options, validOptions);
                // resolve(validOptions);
            }
            else {
                resolve(currentOptions);
            }
        });
    }

    async checkBottom(grid, islandMode, tiles) {
        const currentOptions = this.options;
        //const options = tiles.map(x => x.index);

        return new Promise((resolve) => {
            let selection = this.down; //grid.find(item => item.x === this.x && item.y == this.y + 1);
            if (!selection && islandMode) { selection = new Cell([0]); }

            if (selection) {
                let newOptions = selection.options.reduce((prev, cur) => {
                    // const node = tiles[cur].nodes[Cell.RIGHT];
                    //const availableTiles = tiles.filter(x => Tile.compare(x, Cell.LEFT, node)).map(x => x.index);
                    const node = tiles[cur];
                    const availableTiles = node.up;
                    for (let i = 0; i < availableTiles.length; i++) {
                        if (!prev.includes(availableTiles[i])) { prev.push(availableTiles[i]); }
                    }
                    return prev;
                }, []);
                resolve(newOptions);
                // let validOptions = [];
                // for (let option of selection.options) {
                //     let valid = tiles[option].up;
                //     validOptions = validOptions.concat(valid);
                // }
                // this.checkValid(options, validOptions);
                // resolve(validOptions);
            }
            else {
                resolve(currentOptions);
            }
        });
    }
}