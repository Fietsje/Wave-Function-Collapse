
export class Tile {

    constructor(name, nodes, rotations, disallowSelfConnect) {
        this.name = name;
        this.nodes = nodes;
        this.image = null;
        this.index = -1;
        this.rotations = !!rotations ? rotations : 0;
        this.rotated = 0;
        this.up = [];
        this.right = [];
        this.down = [];
        this.left = [];
        this.disallowSelfConnect = !!disallowSelfConnect;
    }

    static compare(tile, edge, index) {
        return tile.nodes[edge] === index;
    }

    reverseString(s) {
        let arr = s.toString().split("");
        arr = arr.reverse();
        return arr.join("");
    }

    compareEdge(a, b) {
        return a == this.reverseString(b);
    }

    analyze(tiles) {
        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            if (this.disallowSelfConnect && tile.disallowSelfConnect && this.name === tile.name) { continue; }
            // UP
            if (this.compareEdge(tile.nodes[2], this.nodes[0])) {
                this.up.push(i);
            }
            // RIGHT
            if (this.compareEdge(tile.nodes[3], this.nodes[1])) {
                this.right.push(i);
            }
            // DOWN
            if (this.compareEdge(tile.nodes[0], this.nodes[2])) {
                this.down.push(i);
            }
            // LEFT
            if (this.compareEdge(tile.nodes[1], this.nodes[3])) {
                this.left.push(i);
            }
        }
    }

    rotate(num, p5) {
        const w = this.image.width;
        const h = this.image.height;
        const newImg = p5.createGraphics(w, h);
        newImg.imageMode(p5.CENTER);
        newImg.translate(w / 2, h / 2);
        newImg.rotate(p5.HALF_PI * num);
        newImg.image(this.image, 0, 0);

        const newNodes = [];
        const len = this.nodes.length;
        for (let i = 0; i < len; i++) {
            newNodes[i] = this.nodes[(i - num + len) % len];
        }

        const result = new Tile(this.name, newNodes, 0, this.disallowSelfConnect);
        result.rotated = num;
        result.image = newImg;
        return result;
    }
}