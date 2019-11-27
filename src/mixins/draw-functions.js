import utils from './utils'
import { isRegExp } from 'util';

export default {
    mixins: [utils],
    
    computed:{
        ctx(){ return this.$store.state.ctx },
        currentLayer(){ return this.$store.getters.currentLayer },
        brushSize(){ return this.$store.state.brushSize },
        clippedSize(){ return this.$store.state.clippedSize },
        docSize(){ return this.$store.getters.docSize },
        selection(){ return this.$store.state.selection },
        selectionExists(){ return this.selection.w && this.selection.h },

        currentTilemap(){ return this.$store.getters.currentTilemap },
        tiles(){ return this.$store.state.tiles }
    },

    methods:{
        drawPixel(color, x, y, w = this.brushSize, h  = this.brushSize){
            var nX = x
            var nY = y
            var nW = w
            var nH = h
            var tileWidth = this.$store.getters.currentDocument.tileWidth
            var tileHeight = this.$store.getters.currentDocument.tileHeight

            if(this.selectionExists){
                //Clip the brush rect with the selection to make sure we can't draw outside
                nX = Math.max(this.selection.x, x);
                nY = Math.max(this.selection.y, y);
                nW = Math.min(this.selection.x + this.selection.w, x + w) - nX;
                nH = Math.min(this.selection.y + this.selection.h, y + h) - nY;
                
                //Brush is outside of selection
                if(nW <= 0 || nH <= 0) return
            }
            
            //Set the color
            this.ctx.fillStyle = `rgba(${color.join()})`
            this.currentLayer.ctx.fillStyle = `rgba(${color.join()})`
            
            //Get the tile positions that will be affected by the brush
            var targetTiles = this.getTargetTiles(nX, nY, nW, nH)
            if(!targetTiles) return
            
            //Get the Indices of the affected tiles, and the
            //Positions at which those tiles are painted
            var affectedTileIndices = []
            var affectedTilePositions = []
            for (var i = targetTiles.x0; i < targetTiles.x1 + 1; i++) {
                for(var j = targetTiles.y0; j < targetTiles.y1 + 1; j++){
                    var id = this.currentTilemap[i][j]
                    if (id == null) continue
                    if(!affectedTileIndices.includes(id)){
                        affectedTileIndices.push(id)
                        affectedTilePositions.push([i, j])
                    }
                }
            }


            if(affectedTileIndices.length){
                affectedTileIndices.forEach((index, i) => {
                    var tile = this.tiles[index]
                    console.log(this.tiles[index])
                    var positions = this.tiles[index].paintedPositions
    
                    // Position of tile that is being directly drawn on
                    var targetPosition = positions[i];
                    
                    // Relative position of the brush with respect to the target tile
                    var relativeX = nX - targetPosition[0] * tileWidth;
                    var relativeY = nY - targetPosition[1] * tileHeight;
                
                    //Get intersection of tile and brush
                    var clipX = Math.max(0, relativeX);
                    var clipY = Math.max(0, relativeY);
                    var clipW = Math.min(relativeX + nW, tileWidth) - clipX;
                    var clipH = Math.min(relativeY + nH, tileHeight) - clipY;
    
                    positions.forEach(position => {
                        var absX = clipX + position[0] * tileWidth;
                        var absY = clipY + position[1] * tileHeight;
                        this.currentLayer.ctx.fillRect(absX, absY, clipW, clipH);
                        this.ctx.fillRect(absX + this.clippedSize[0], absY - this.clippedSize[1], clipW, clipH);
                    })
    
                    tile.ctx.fillStyle = `rgba(${color.join()})`
                    tile.ctx.fillRect(relativeX, relativeY, clipW, clipH)
                })
            } else {

                //No specific tiles were drawn on
                this.currentLayer.ctx.fillRect(nX, nY, nW, nH)
                this.ctx.fillRect(nX + this.clippedSize[0], nY + this.clippedSize[1], nW, nH)
            }
        },

        erasePixel(x, y, w = this.brushSize, h = this.brushSize){
            var nX = x
            var nY = y
            var nW = w
            var nH = h

            if(this.selectionExists){
                //Clip the brush rect with the selection to make sure we can't draw outside
                nX = Math.max(this.selection.x, x);
                nY = Math.max(this.selection.y, y);
                nW = Math.min(this.selection.x + this.selection.w, x + w) - nX;
                nH = Math.min(this.selection.y + this.selection.h, y + h) - nY;
                
                //Brush is outside of selection
                if(nW <= 0 || nH <= 0) return
            }
            this.currentLayer.ctx.clearRect(nX ,nY, nW, nH)
            this.ctx.clearRect(nX ,nY, nW, nH)
        },
        
        drawLine(x0, y0, x1, y1, color){
            var dx = Math.abs(x1 - x0);
            var dy = Math.abs(y1 - y0);
            var sx = (x0 < x1) ? 1 : -1;
            var sy = (y0 < y1) ? 1 : -1;
            var err = dx - dy;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                if(color){
                    this.drawPixel(color, x0, y0);
                } else {
                    this.erasePixel(x0, y0)
                }

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
        },

        drawRectangle(color, x1, y1, x2, y2){
            this.drawLine(x1, y1, x2, y1, color)
            this.drawLine(x1, y1, x1, y2, color)
            this.drawLine(x1, y2, x2, y2, color)
            this.drawLine(x2, y1, x2, y2, color)
        },

        drawEllipse(color, x0, y0, x1, y1){
            var a = Math.abs(x1 - x0), b = Math.abs(y1 - y0), b1 = b & 1;        /* diameter */
            var dx = 4 * (1.0 - a) * b * b, dy = 4 * (b1 + 1) * a * a;              /* error increment */
            var err = dx + dy + b1 * a * a, e2;                             /* error of 1.step */
        
            if (x0 > x1) { x0 = x1; x1 += a; }        /* if called with swapped points */
            if (y0 > y1) y0 = y1;                                  /* .. exchange them */
            y0 += (b + 1) >> 1; y1 = y0 - b1;                              /* starting pixel */
            a = 8 * a * a; b1 = 8 * b * b;
        
            do {
                this.drawPixel(color, x1, y0);                                      /*   I. Quadrant */
                this.drawPixel(color, x0, y0);                                      /*  II. Quadrant */
                this.drawPixel(color, x0, y1);                                      /* III. Quadrant */
                this.drawPixel(color, x1, y1);                                      /*  IV. Quadrant */
                e2 = 2 * err;
                if (e2 <= dy) { y0++; y1--; err += dy += a; }                 /* y step */
                if (e2 >= dx || 2 * err > dy) { x0++; x1--; err += dx += b1; }       /* x */
            } while (x0 <= x1);
        
            while (y0 - y1 <= b) {
                this.drawPixel(color, x0 - 1, y0);
                this.drawPixel(color, x1 + 1, y0++);
                this.drawPixel(color, x0 - 1, y1);
                this.drawPixel(color, x1 + 1, y1--);
            }
        },

        floodFill(x, y, newColor, oldColor){          
            var pixelStack = [[x, y]]
            
            var selectionX, selectionY, selectionW, selectionH
            if(this.selectionExists){
                selectionX = this.selection.x
                selectionY = this.selection.y
                selectionW = this.selection.w
                selectionH = this.selection.h
            } else {
                selectionX = 0
                selectionY = 0
                selectionW = this.docSize.width
                selectionH = this.docSize.height
            }
            
            var colorLayer = this.currentLayer.ctx.getImageData(0, 0, this.docSize.width, this.docSize.height);

            while(pixelStack.length) {
                var new_pos, pixelPos, reachLeft, reachRight
                new_pos = pixelStack.pop()
                x = new_pos[0]
                y = new_pos[1]
                
                pixelPos = (x + y * this.docSize.width) * 4
                while(y-- >= selectionY && matchStartColor(pixelPos)) {
                    pixelPos -= this.docSize.width * 4
                }
                
                //Increment pixel pos back into selection bounds
                pixelPos += this.docSize.width * 4
                ++y
                reachLeft = false
                reachRight = false
                while(y++ < selectionY + selectionH - 1 && matchStartColor(pixelPos)){
                    // var containing_tile = state.tile_manager.get_containing_tile(x, y);
                    // var target_tile = state.current_layer.tilemap[containing_tile[0] + containing_tile[1] * state.tiles_x];
                    // if(target_tile != null){
                    //     state.tile_manager.tiles[target_tile].ctx.fillStyle = state.color_picker.color;
                    //     state.tile_manager.tiles[target_tile].ctx.fillRect(x - containing_tile[0] * state.tile_w, y - containing_tile[1] * state.tile_h, 1, 1);
                    // }   
                    colorPixel(pixelPos)
                    if(x > selectionX){
                        if(matchStartColor(pixelPos - 4)){
                            if(!reachLeft){
                                pixelStack.push([x - 1, y])
                                reachLeft = true;
                            }
                        }   else if(reachLeft){
                            reachLeft = false;
                        }
                    }
                    if(x < selectionX + selectionW - 1){
                        if(matchStartColor(pixelPos + 4)) {
                            if(!reachRight){
                                pixelStack.push([x + 1, y])
                                reachRight = true
                            }
                        } else if(reachRight){
                            reachRight = false
                        }
                    }
                            
                    pixelPos += this.docSize.width * 4
                }
            }

            this.currentLayer.ctx.putImageData(colorLayer, 0, 0)
            
            function matchStartColor(pixelPos){
                var r = colorLayer.data[pixelPos]	
                var g = colorLayer.data[pixelPos+1]
                var b = colorLayer.data[pixelPos+2]
                var a = colorLayer.data[pixelPos+3]

                return (r == oldColor[0] && g == oldColor[1] && b == oldColor[2] && a == oldColor[3])
            }

            function colorPixel(pixelPos){
                colorLayer.data[pixelPos] = newColor[0]
                colorLayer.data[pixelPos+1] = newColor[1]
                colorLayer.data[pixelPos+2] = newColor[2]
                colorLayer.data[pixelPos+3] = 255
            }
        },

        paintTile(x, y, tile){
            tile.paintedPositions.push([x, y])
            this.$set(this.currentTilemap[x], y, tile.id)
        },

        drawPreviewPixel(color, x, y){
            var nX = x
            var nY = y
            var nW = this.brushSize
            var nH = this.brushSize

            if(this.selectionExists){
                //Clip the brush rect with the selection to make sure we can't draw outside
                nX = Math.max(this.selection.x, x)
                nY = Math.max(this.selection.y, y)
                nW = Math.min(this.selection.x + this.selection.w, x + this.brushSize) - nX
                nH = Math.min(this.selection.y + this.selection.h, y + this.brushSize) - nY
                
                //Brush is outside of selection
                if(nW <= 0 || nH <= 0) return
            }

            this.ctx.fillStyle = `rgba(${color.join()})`
            this.ctx.fillRect(nX + this.clippedSize[0], nY + this.clippedSize[1], nW, nH)
        },

        erasePreviewPixel(x, y){
            this.ctx.beginPath()
            this.ctx.clearRect(x + this.clippedSize[0], y + this.clippedSize[1], this.brushSize, this.brushSize)
        },  

        drawPreviewLine(x0, y0, x1, y1, color){
            var dx = Math.abs(x1 - x0);
            var dy = Math.abs(y1 - y0);
            var sx = (x0 < x1) ? 1 : -1;
            var sy = (y0 < y1) ? 1 : -1;
            var err = dx - dy;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                if(color){
                    this.drawPreviewPixel(color, x0, y0)
                } else {
                    this.erasePreviewPixel(x0, y0)
                }

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
        },

        drawPreviewRectangle(color, x1, y1, x2, y2){
            this.drawPreviewLine(x1, y1, x2, y1, color)
            this.drawPreviewLine(x1, y1, x1, y2, color)
            this.drawPreviewLine(x1, y2, x2, y2, color)
            this.drawPreviewLine(x2, y1, x2, y2, color) 
        },

        drawPreviewEllipse(color, x0, y0, x1, y1){
            var a = Math.abs(x1 - x0), b = Math.abs(y1 - y0), b1 = b & 1;        /* diameter */
            var dx = 4 * (1.0 - a) * b * b, dy = 4 * (b1 + 1) * a * a;              /* error increment */
            var err = dx + dy + b1 * a * a, e2;                             /* error of 1.step */

            if (x0 > x1) { x0 = x1; x1 += a; }        /* if called with swapped points */
            if (y0 > y1) y0 = y1;                                  /* .. exchange them */
            y0 += (b + 1) >> 1; y1 = y0 - b1;                              /* starting pixel */
            a = 8 * a * a; b1 = 8 * b * b;

            do {
                this.drawPreviewPixel(color, x1, y0);                                      /*   I. Quadrant */
                this.drawPreviewPixel(color, x0, y0);                                      /*  II. Quadrant */
                this.drawPreviewPixel(color, x0, y1);                                      /* III. Quadrant */
                this.drawPreviewPixel(color, x1, y1);                                      /*  IV. Quadrant */
                e2 = 2 * err;
                if (e2 <= dy) { y0++; y1--; err += dy += a; }                 /* y step */
                if (e2 >= dx || 2 * err > dy) { x0++; x1--; err += dx += b1; }       /* x */
            } while (x0 <= x1);

            while (y0 - y1 <= b) {
                this.drawPreviewPixel(color, x0 - 1, y0);
                this.drawPreviewPixel(color, x1 + 1, y0++);
                this.drawPreviewPixel(color, x0 - 1, y1);
                this.drawPreviewPixel(color, x1 + 1, y1--);
            }
        }
    }
}
