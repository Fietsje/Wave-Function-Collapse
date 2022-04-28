var sketch = (() => {

    let setRandomItem = false;

    const size = 40;
    const width = 1920;
    const height = 1080;
    const grid = new Grid(width, height, size);
    const tileSet = TileSet.circuit();

    const pickRandomItem = false;
    const islandModeOn = tileSet.supportsIslandMode && true;
    const emptyCenter = false;
    const reverseSort = false;

    preload = () => {
        for (let index = 0; index < tileSet.tiles.length; index++) {
            const element = tileSet.tiles[index];
            element.image = loadImage('tiles/' + element.name + '.png');
        }
    }

    setup = () => {
        tileSet.rotateTiles();
        tileSet.adjust();
        tileSet.analyze();

        grid.initialize(tileSet.tiles.map(x => x.index));
        if (emptyCenter) {
            grid.setEmptyCenter();
        }

        createCanvas(width, height);
    }

    mousePressed = () => {
        // const item = grid.find(item =>
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

    draw = async () => {
        //return;
        background(151);
        if (setRandomItem) {
            grid.setRandomCell(pickRandomItem, reverseSort);
        }
        setRandomItem = true;

        for (let index = 0; index < grid.cells.length; index++) {
            let element = grid.cells[index];
            let tile = tileSet.tiles[element.options[0]];

            if (element.isCollapsed && !!tile) {
                image(tile.image, element.x1, element.y1, size, size);
            }
            else {
                fill(0);
                stroke(255);
                rect(element.x1, element.y1, size, size);
            }
        }

        await grid.checkCells(tileSet, islandModeOn);
    }
})(new p5(sketch, 'canvas'));