class TileSet {
    static alltiles = {
        blank: new Tile('blank', [0, 0, 0, 0]),
        down: new Tile('down', [0, 1, 1, 1]),
        horizontal: new Tile('horizontal', [0, 1, 0, 1]),
        left: new Tile('left', [1, 0, 1, 1]),
        right: new Tile('right', [1, 1, 1, 0]),
        up: new Tile('up', [1, 1, 0, 1]),
        vertical: new Tile('vertical', [1, 0, 1, 0]),
        bottomleft: new Tile('bottomleft', [1, 0, 0, 1]),
        bottomright: new Tile('bottomright', [1, 1, 0, 0]),
        topleft: new Tile('topleft', [0, 1, 1, 0]),
        topright: new Tile('topright', [0, 0, 1, 1]),
    };

    constructor(tiles) {
        this.tiles = tiles;
        this.supportsSettingBorder = false;
        this.adjust = () => { };
        this.centerOption = 0;
        this.borderOption = 0;
        this.recommendedEmptyCenterAreaFactor = 2;
    }

    analyze() {
        for (let index = 0; index < this.tiles.length; index++) {
            const element = this.tiles[index];
            element.analyze(this.tiles);
        }
    }

    rotateTiles() {
        for (let index = 0; index < this.tiles.length; index++) {
            const element = this.tiles[index];
            if (element.rotations > 0) {
                for (let i = 0; i < element.rotations; i++) {
                    this.tiles.push(element.rotate(i + 1));
                }
            }
            element.index = index;
        }
    }

    static cornersOnly() {
        const set = [
            this.alltiles.blank,
            this.alltiles.bottomleft,
            this.alltiles.bottomright,
            this.alltiles.topleft,
            this.alltiles.topright
        ];

        for (let index = 0; index < set.length; index++) {
            const element = set[index];
            element.index = index;
        }

        const result = new TileSet(set);
        result.supportsSettingBorder = true;
        return result;
    }

    static simple() {
        const set = [
            this.alltiles.blank,
            this.alltiles.down,
            this.alltiles.left,
            this.alltiles.right,
            this.alltiles.up
        ];

        for (let index = 0; index < set.length; index++) {
            const element = set[index];
        }

        const result = new TileSet(set);
        result.supportsSettingBorder = false;
        return result;
    }

    static extended() {
        const set = [
            this.alltiles.blank,
            this.alltiles.down,
            this.alltiles.left,
            this.alltiles.right,
            this.alltiles.up,
            this.alltiles.horizontal,
            this.alltiles.vertical
        ];

        for (let index = 0; index < set.length; index++) {
            const element = set[index];
            element.index = index;
        }

        const result = new TileSet(set);
        result.supportsSettingBorder = false;
        return result;
    }

    static full() {
        const set = [
            this.alltiles.blank,
            this.alltiles.down,
            this.alltiles.left,
            this.alltiles.right,
            this.alltiles.up,
            this.alltiles.horizontal,
            this.alltiles.vertical,
            this.alltiles.bottomleft,
            this.alltiles.bottomright,
            this.alltiles.topleft,
            this.alltiles.topright,
        ];

        for (let index = 0; index < set.length; index++) {
            const element = set[index];
            element.index = index;
        }

        const result = new TileSet(set);
        result.supportsSettingBorder = true;
        return result;
    }

    static circuit() {
        const blank = 0;
        const darkgreen = 1;
        const lightgreen = 2;
        const grey = 3;
        const cornerTop = 5;
        const cornerLeft = 6;

        const set = [
            new Tile('circuit/0', ["AAA", "AAA", "AAA", "AAA"]),
            new Tile('circuit/1', ["BBB", "BBB", "BBB", "BBB"]),
            new Tile('circuit/2', ["BBB", "BCB", "BBB", "BBB"], 3),
            new Tile('circuit/3', ["BBB", "BDB", "BBB", "BDB"], 1),
            new Tile('circuit/4', ["ABB", "BCB", "BBA", "AAA"], 3),
            new Tile('circuit/5', ["ABB", "BBB", "BBB", "BBA"], 3, true),
            new Tile('circuit/6', ["BBB", "BCB", "BBB", "BCB"], 1),
            new Tile('circuit/7', ["BDB", "BCB", "BDB", "BCB"], 1),
            new Tile('circuit/8', ["BDB", "BBB", "BCB", "BBB"], 3),
            new Tile('circuit/9', ["BCB", "BCB", "BBB", "BCB"], 3),
            new Tile('circuit/10', ["BCB", "BCB", "BCB", "BCB"], 3),
            new Tile('circuit/11', ["BCB", "BCB", "BBB", "BBB"], 3),
            new Tile('circuit/12', ["BBB", "BCB", "BBB", "BCB"], 1),
        ];

        for (let index = 0; index < set.length; index++) {
            const element = set[index];
            element.index = index;
        }

        const result = new TileSet(set);
        result.supportsSettingBorder = true;
        result.borderOption = 1;
        result.centerOption = 0;
        result.recommendedEmptyCenterAreaFactor = 4;
        result.adjust = () => { /* nothing yet */ };
        return result;
    }

}