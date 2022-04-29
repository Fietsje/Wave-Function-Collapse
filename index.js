var sketch = (() => {

    let setRandomItem = false;

    const size = 40;
    const width = 1920;
    const height = 1080;
    const grid = new Grid(width, height, size);
    const tileSet = TileSet.circuit();

    const pickRandomItem = false;
    const settingABorder = tileSet.supportsSettingBorder && true;
    const emptyCenter = true;

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

        grid.initialize(tileSet);
        grid.sortAscending();

        if (emptyCenter) {
            grid.setEmptyCenter(tileSet.centerOption, tileSet.recommendedEmptyCenterAreaFactor);
        }

        createCanvas(width, height);
    }

    mousePressed = () => {
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

    draw = async () => {
        background(151);
        if (setRandomItem) {
            const randomCell = grid.setRandomCell(pickRandomItem);
            await grid.checkAffectedCells(tileSet, settingABorder, randomCell);
        }

        await grid.checkCells(tileSet, settingABorder);

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

    }
})(new p5(sketch, 'canvas'));