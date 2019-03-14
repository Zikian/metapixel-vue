export default {
    computed:{
        ctx(){ return this.$store.state.ctx },
        currentLayer(){ return this.$store.getters.currentLayer },
        brushSize(){ return this.$store.state.brushSize },
        hiddenSize(){ return this.$store.state.hiddenSize }
    },

    methods:{
        drawPixel(color, x, y){
            this.ctx.fillStyle = `rgba(${color.join()})`
            this.currentLayer.ctx.fillStyle = `rgba(${color.join()})`

            this.currentLayer.ctx.fillRect(x, y, this.brushSize, this.brushSize)
            this.ctx.fillRect(x + this.hiddenSize[0], y + this.hiddenSize[1], this.brushSize, this.brushSize)
        },
        
        drawLine(color, x0, y0, x1, y1){
            var dx = Math.abs(x1 - x0);
            var dy = Math.abs(y1 - y0);
            var sx = (x0 < x1) ? 1 : -1;
            var sy = (y0 < y1) ? 1 : -1;
            var err = dx - dy;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                this.drawPixel(color, x0, y0);

                if ((x0 == x1) && (y0 == y1)) { break; }

                var e2 = 2 * err;

                if (e2 > -dy) {
                    err -= dy;
                    x0 += sx;
                }

                if (e2 < dx) {
                    err += dx;
                    y0 += sy;
                }
            }
        }
    }
}