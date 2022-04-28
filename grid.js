class Grid {
    sortOption = 1;
    constructor(width, height, size) {
        this.cells = [];
        this.width = width;
        this.height = height;
        this.size = size;
        this.options = [];
    }

    sortAscending() { this.sortOption = 1; }

    sortDescending() { this.sortOption = 2; }

    doNotSort() { this.sortOption = -1; }

    random(items) {
        const rnd = Math.floor(Math.random() * items.length);
        return items[rnd];
    }

    arrayMatches(array1, array2) {
        const result = [];
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < array2.length; j++) {
                if (array1[i] == array2[j]) { result.push(array1[i]); }
            }
        }

        return result;
    }

    distinct = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    initialize(options) {
        this.options = options;
        this.cells = Array.from({ length: (Math.ceil(this.width / this.size) * Math.ceil(this.height / this.size)) }, (e, idx) => new Cell(this.options));
        let row = 0;
        let column = 0;
        let dimensions = this.width / this.size;

        for (let index = 0; index < this.cells.length; index++) {
            const element = this.cells[index];
            element.x = column;
            element.y = row;
            element.x1 = column * this.size;
            element.x2 = element.x1 + this.size;
            element.y1 = row * this.size;
            element.y2 = element.y1 + this.size;

            column++;
            if (column >= dimensions) {
                row++;
                column = 0;
            }
        }

        for (let index = 0; index < this.cells.length; index++) {
            const element = this.cells[index];
            const left = this.cells.find(item => item.x == element.x - 1 && item.y === element.y);
            const right = this.cells.find(item => item.x == element.x + 1 && item.y === element.y);
            const top = this.cells.find(item => item.x === element.x && item.y == element.y - 1);
            const bottom = this.cells.find(item => item.x === element.x && item.y == element.y + 1);

            element.up = top;
            element.right = right;
            element.down = bottom;
            element.left = left;
        }
    }

    setEmptyCenter() {
        const linesInCenterHorizontal = Math.ceil(this.width / this.size / 2);
        const linesInCenterVertical = Math.ceil(this.height / this.size / 2);

        const blanks = this.cells.filter(x =>
            (x.x + 1) >= linesInCenterHorizontal / 2 && (x.x + 1) < linesInCenterHorizontal * 1.5 &&
            (x.y + 1) >= linesInCenterVertical / 2 && (x.y + 1) < linesInCenterVertical * 1.5
        );
        for (let index = 0; index < blanks.length; index++) {
            const element = blanks[index];
            element.setOptions([0]);
            element.collapse();
        }
    }

    setRandomCell(pickRandomItem) {
        const copy = this.cells.filter(x => !x.isCollapsed);

        if (copy.length === 0) {
            return;
        }

        if (copy.length <= 1) {
            noLoop();
        }

        if (this.sortOption === 1) { copy.sort((a, b) => { return a.options.length - b.options.length }); }
        else if (this.sortOption === 2) { copy.sort((a, b) => { return b.options.length - a.options.length }); }
        else { /* no sorting */ }

        let len = copy[0].options.length;
        let stopIndex = copy.findIndex(x => x.options.length > len);

        if (stopIndex > 0) {
            copy.splice(stopIndex);
        }
        const cell = pickRandomItem ? this.random(copy) : copy[0];
        const pick = this.random(cell.options);
        cell.setOptions([pick]);
        cell.collapse();
    }

    async checkCells(tileSet, islandModeOn) {
        for (let index = 0; index < this.cells.length; index++) {
            let element = this.cells[index];
            let validOptions = this.options;

            if (!element.collapsed) {
                const upOptions = element.checkTop(this.cells, islandModeOn, tileSet.tiles);
                const rightOptions = element.checkRight(this.cells, islandModeOn, tileSet.tiles);
                const downOptions = element.checkBottom(this.cells, islandModeOn, tileSet.tiles);
                const leftOptions = element.checkLeft(this.cells, islandModeOn, tileSet.tiles);

                const allOptions = await Promise.all([upOptions, rightOptions, downOptions, leftOptions]);//
                for (let i = 0; i < allOptions.length; i++) {
                    validOptions = this.arrayMatches(validOptions, allOptions[i]);
                }
                element.setOptions(validOptions.filter(this.distinct).sort());
            }
        }
    }
}