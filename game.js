import { TileSet } from "./tileset.js";
import { Grid } from "./grid.js";

const sketch = ((p5) => {
    let setRandomItem = false;

    const size = 40;
    const width = 1920;
    const height = 1080;
    const grid = new Grid(width, height, size);
    const tileSet = TileSet.circuit();

    const pickRandomItem = false;
    const settingABorder = tileSet.supportsSettingBorder && true;
    const emptyCenter = true;

    p5.preload = () => {
        for (let index = 0; index < tileSet.tiles.length; index++) {
            const element = tileSet.tiles[index];
            element.image = p5.loadImage('tiles/' + element.name + '.png');
        }
    }

    p5.setup = () => {
        tileSet.rotateTiles(p5);
        tileSet.adjust();
        tileSet.analyze();

        grid.initialize(tileSet);
        grid.sortAscending();

        if (emptyCenter) {
            grid.setEmptyCenter(tileSet.centerOption, tileSet.recommendedEmptyCenterAreaFactor);
        }

        p5.createCanvas(width, height);
    }

    p5.mousePressed = () => {
        // const item = grid.cells.find(item =>
        //     item.x1 < mouseX &&
        //     item.x2 > mouseX &&
        //     item.y1 < mouseY &&
        //     item.y2 > mouseY
        // );

        // if (item && !item.isCollapsed) {
        //     item.options = [random(item.options)];
        //     item.collapsed = true;
        //     redraw();
        // }
        // setup();
        // redraw();
        // console.table(grid);
    }

    p5.draw = async () => {
        p5.background(151);
        if (setRandomItem) {
            const randomCell = grid.setRandomCell(pickRandomItem, p5);
            await grid.checkAffectedCells(tileSet, settingABorder, randomCell);
        }

        await grid.checkCells(tileSet, settingABorder);

        setRandomItem = true;

        for (let index = 0; index < grid.cells.length; index++) {
            let element = grid.cells[index];
            let tile = tileSet.tiles[element.options[0]];

            if (element.isCollapsed && !!tile) {
                p5.image(tile.image, element.x1, element.y1, size, size);
            }
            else {
                p5.fill(0);
                p5.stroke(255);
                p5.rect(element.x1, element.y1, size, size);
            }
        }

    }
});

sketch(new p5(sketch, 'canvas'));
