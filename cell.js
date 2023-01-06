export class Cell {
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

    async checkLeft(grid, gridHasABorder, tileSet) {
        const currentOptions = this.options;
        const tiles = tileSet.tiles;

        return new Promise((resolve) => {
            let selection = this.left;
            if (!selection && gridHasABorder) { selection = new Cell([tileSet.borderOption]); }

            if (selection) {
                let newOptions = selection.options.reduce((prev, cur) => {
                    const node = tiles[cur];
                    const availableTiles = node.right;
                    for (let i = 0; i < availableTiles.length; i++) {
                        if (!prev.includes(availableTiles[i])) { prev.push(availableTiles[i]); }
                    }
                    return prev;
                }, []);
                resolve(newOptions);
            }
            else {
                resolve(currentOptions);
            }
        });
    }

    async checkRight(grid, gridHasABorder, tileSet) {
        const currentOptions = this.options;
        const tiles = tileSet.tiles;

        return new Promise((resolve) => {
            let selection = this.right;
            if (!selection && gridHasABorder) { selection = new Cell([tileSet.borderOption]); }

            if (selection) {
                let newOptions = selection.options.reduce((prev, cur) => {
                    const node = tiles[cur];
                    const availableTiles = node.left;
                    for (let i = 0; i < availableTiles.length; i++) {
                        if (!prev.includes(availableTiles[i])) { prev.push(availableTiles[i]); }
                    }
                    return prev;
                }, []);
                resolve(newOptions);
            }
            else {
                resolve(currentOptions);
            }
        });
    }

    async checkTop(grid, gridHasABorder, tileSet) {
        const currentOptions = this.options;
        const tiles = tileSet.tiles;

        return new Promise((resolve) => {
            let selection = this.up;
            if (!selection && gridHasABorder) { selection = new Cell([tileSet.borderOption]); }

            if (selection) {
                let newOptions = selection.options.reduce((prev, cur) => {
                    const node = tiles[cur];
                    const availableTiles = node.down;
                    for (let i = 0; i < availableTiles.length; i++) {
                        if (!prev.includes(availableTiles[i])) { prev.push(availableTiles[i]); }
                    }
                    return prev;
                }, []);
                resolve(newOptions);
            }
            else {
                resolve(currentOptions);
            }
        });
    }

    async checkBottom(grid, gridHasABorder, tileSet) {
        const currentOptions = this.options;
        const tiles = tileSet.tiles;

        return new Promise((resolve) => {
            let selection = this.down;
            if (!selection && gridHasABorder) { selection = new Cell([tileSet.borderOption]); }

            if (selection) {
                let newOptions = selection.options.reduce((prev, cur) => {
                    const node = tiles[cur];
                    const availableTiles = node.up;
                    for (let i = 0; i < availableTiles.length; i++) {
                        if (!prev.includes(availableTiles[i])) { prev.push(availableTiles[i]); }
                    }
                    return prev;
                }, []);
                resolve(newOptions);
            }
            else {
                resolve(currentOptions);
            }
        });
    }
}