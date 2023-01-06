import { Cell } from "./cell.js";

export class Grid {
    tileSetData = null;
    sortFunction = null;

    constructor(width, height, size, p5cfg) {
        this.cells = [];
        this.width = width;
        this.height = height;
        this.size = size;
        this.options = [];
        this.p5 = p5cfg;
    }

    sortAscending() { this.sortFunction = this.sortItemsAscending; }

    sortDescending() { this.sortFunction = this.sortItemsDescending; }

    doNotSort() { this.sortFunction = null; }

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

    initialize(tileSet) {
        this.tileSetData = tileSet
        this.options = tileSet.tiles.map(x => x.index);
        this.cells = Array.from({ length: (Math.ceil(this.width / this.size) * Math.ceil(this.height / this.size)) }, (e, idx) => new Cell(this.options, this.p5));
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

    setEmptyCenter(option, factor) {
        if (!factor) { factor = 2; }
        const linesInCenterHorizontal = Math.ceil(this.width / this.size / 2);
        const linesInCenterVertical = Math.ceil(this.height / this.size / 2);

        const coordinates = {
            factor,
            cols: Math.ceil(this.width / this.size),
            rows: Math.ceil(this.height / this.size),
            linesInCenterHorizontal: Math.ceil(this.width / this.size / factor),
            linesInCenterVertical: Math.ceil(this.height / this.size / factor),
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        };

        coordinates.x1 = Math.ceil(coordinates.cols / 2 - coordinates.linesInCenterHorizontal / 2);
        coordinates.x2 = coordinates.x1 + coordinates.linesInCenterHorizontal;
        coordinates.y1 = Math.ceil(coordinates.rows / 2 - coordinates.linesInCenterVertical / 2);
        coordinates.y2 = coordinates.y1 + coordinates.linesInCenterVertical;

        const blanks = this.cells.filter(x =>
            (x.x + 1) >= coordinates.x1 && (x.x + 1) < coordinates.x2 &&
            (x.y + 1) >= coordinates.y1 && (x.y + 1) < coordinates.y2
        );

        for (let index = 0; index < blanks.length; index++) {
            const element = blanks[index];
            element.setOptions([option || 0]);
            element.collapse();
        }
    }

    setRandomCell(pickRandomItem, p5) {
        const copy = this.cells.filter(x => !x.isCollapsed);

        if (copy.length === 0) {
            return;
        }

        if (copy.length <= 1) {
            p5.noLoop();
        }

        if (this.sortFunction) { copy.sort(this.sortFunction); }
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

        return cell;
    }

    sortItemsAscending(a, b) {
        if (a.options.length != b.options.length) { return a.options.length - b.options.length; }
        else { return a.index - b.index; }
    }

    sortItemsDescending(a, b) {
        if (a.options.length != b.options.length) { return b.options.length - a.options.length; }
        else { return b.index - a.index; }
    }

    async checkAffectedCells(tileSet, gridHasABorder, cell) {
        const cells = [];
        if (cell.up) { cells.push(cell.up); }
        if (cell.down) { cells.push(cell.down); }
        if (cell.left) { cells.push(cell.left); }
        if (cell.right) { cells.push(cell.right); }

        await this.checkCellList(tileSet, gridHasABorder, cells);
    }

    async checkCells(tileSet, gridHasABorder) {
        await this.checkCellList(tileSet, gridHasABorder, this.cells);
    }

    async checkCellList(tileSet, gridHasABorder, cells) {
        for (let index = 0; index < cells.length; index++) {
            let element = cells[index];
            let validOptions = this.options;

            if (!element.collapsed) {
                const upOptions = element.checkTop(cells, gridHasABorder, tileSet);
                const rightOptions = element.checkRight(cells, gridHasABorder, tileSet);
                const downOptions = element.checkBottom(cells, gridHasABorder, tileSet);
                const leftOptions = element.checkLeft(cells, gridHasABorder, tileSet);

                const allOptions = await Promise.all([upOptions, rightOptions, downOptions, leftOptions]);//
                for (let i = 0; i < allOptions.length; i++) {
                    validOptions = this.arrayMatches(validOptions, allOptions[i]);
                }
                element.setOptions(validOptions.filter(this.distinct).sort());
            }
        }
    }
}