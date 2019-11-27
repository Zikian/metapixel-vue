import EventBus from '../components/EventBus'

export default {
    methods: {
        clamp: (x, a, b) => {
            return Math.max(a, Math.min(b, x));
        },

        pointInRect(x, y, rect){
            //rect should be an object with x, y, w, h
            return (x.isBetween(rect.x, rect.x + rect.w) &&
                    y.isBetween(rect.y, rect.y + rect.h))
        },

        calculateAnchoredPosition(anchor, prevW, prevH, w, h) {
            let dW = w - prevW;
            let dH = h - prevH;
            let anchorRow  = Math.floor(anchor / 3);
            let anchorColumn = anchor % 3

            let x = (dW / 2) * anchorColumn
            let y = (dH / 2) * anchorRow

            return { x: Math.floor(x), y: Math.floor(y) }
        },

        intersectRects(rect1, rect2){
            var x = Math.max(rect1.x, rect2.x)
            var y = Math.max(rect1.y, rect2.y)
            var w = Math.min(rect1.x + rect1.w, rect2.w) - x
            var h = Math.min(rect1.y + rect1.h, rect2.h) - y

            return { x: x, y: y, w: w, h: h }
        },

        rectToSquare(x1, y1, x2, y2){
            var dx = x2 - x1;   
            var dy = y2 - y1;
        
            if(dx > 0 && dy > 0){
                return [x1 + dx, y1 + dx];
            } else if (dx > 0 && dy < 0){
                return [x1 + dx, y1 - dx];
            } else if (dx < 0 && dy < 0){
                return [x1 + dx, y1 + dx];
            }
            return [x1 + dx, y1 - dx];
        },
        
        getTargetTile(x, y){
            var currentDocument = this.$store.getters.currentDocument

            x = Math.floor(x / currentDocument.tileWidth);
            y = Math.floor(y / currentDocument.tileHeight); 

            if(x.isBetween(0, currentDocument.xTiles - 1) && y.isBetween(0, currentDocument.yTiles - 1)){
                return [x, y];
            }
            return
        },

        getTargetTiles(x, y, w, h){
            //Get the tiles that include at least a portion of the rectangle x, y, w, h

            var currentDocument = this.$store.getters.currentDocument
            var x0 = Math.floor(x / currentDocument.tileWidth)
            var x1 = Math.floor((x + w - 1) / currentDocument.tileWidth)
            var y0 = Math.floor(y / currentDocument.tileHeight)
            var y1 = Math.floor((y + h - 1) / currentDocument.tileHeight)
            
            if(x0 < 0 || x0 >= currentDocument.xTiles) return
            if(x1 < 0 || x1 >= currentDocument.xTiles) return
            if(y0 < 0 || y0 >= currentDocument.yTiles) return
            if(y1 < 0 || y1 >= currentDocument.yTiles) return

            //Returns a rectangle of tiles                
            return { x0: x0, y0: y0, x1: x1, y1: y1 }
        },

        openImageFile(){
            var vueInstance = this

            var fileInput = document.createElement('input')
            fileInput.type = 'file'

            fileInput.onchange = () => {
                var file = event.target.files[0];
                if(!file) { return; }
                if(file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/gif"){
                    alert("Incorrect filetype (PNG / JPG / GIF)")
                    return;
                }
    
                var reader = new FileReader();
                reader.onload = function(){
                    var img = new Image();
                    img.onload = function(){
                        var currentDocument = vueInstance.$store.getters.currentDocument
                        currentDocument.type = 'single-image'
                        currentDocument.name = file.name
                        currentDocument.width = this.width
                        currentDocument.height = this.height
                        EventBus.$emit('new-document')

                        vueInstance.$store.getters.currentLayer.canvas.imageSmootingEnabled = false;
                        vueInstance.$store.getters.currentLayer.ctx.drawImage(this, 0, 0);
                        
                        EventBus.$emit('redraw-background')
                        EventBus.$emit('render-canvas')
                        EventBus.$emit('render-preview')
                    }
                    img.src = event.target.result;
                }
                reader.readAsDataURL(file);
            }

            fileInput.click()
        },

        RGBtoHSL(rgbArr){
            var r1 = rgbArr[0] / 255;
            var g1 = rgbArr[1] / 255;
            var b1 = rgbArr[2] / 255;
        
            var maxColor = Math.max(r1,g1,b1);
            var minColor = Math.min(r1,g1,b1);
            //Calculate L:
            var L = (maxColor + minColor) / 2 ;
            var S = 0;
            var H = 0;
            if(maxColor != minColor){
                //Calculate S:
                if(L < 0.5){
                    S = (maxColor - minColor) / (maxColor + minColor);
                }else{
                    S = (maxColor - minColor) / (2.0 - maxColor - minColor);
                }
                //Calculate H:
                if(r1 == maxColor){
                    H = (g1-b1) / (maxColor - minColor);
                }else if(g1 == maxColor){
                    H = 2.0 + (b1 - r1) / (maxColor - minColor);
                }else{
                    H = 4.0 + (r1 - g1) / (maxColor - minColor);
                }
            }
        
            L = L * 100;
            S = S * 100;
            H = H * 60;
            if(H<0){
                H += 360;
            }
            var result = [Math.round(H), Math.round(S), Math.round(L)];
            return result;
        },

        HSLtoRGB (h, s, l) {
            var r, g, b, m, c, x
        
            if (!isFinite(h)) h = 0
            if (!isFinite(s)) s = 0
            if (!isFinite(l)) l = 0
        
            h /= 60
            if (h < 0) h = 6 - (-h % 6)
            h %= 6
        
            s = Math.max(0, Math.min(1, s / 100))
            l = Math.max(0, Math.min(1, l / 100))
        
            c = (1 - Math.abs((2 * l) - 1)) * s
            x = c * (1 - Math.abs((h % 2) - 1))
        
            if (h < 1) {
                r = c
                g = x
                b = 0
            } else if (h < 2) {
                r = x
                g = c
                b = 0
            } else if (h < 3) {
                r = 0
                g = c
                b = x
            } else if (h < 4) {
                r = 0
                g = x
                b = c
            } else if (h < 5) {
                r = x
                g = 0
                b = c
            } else {
                r = c
                g = 0
                b = x
            }
        
            m = l - c / 2
            r = Math.round((r + m) * 255)
            g = Math.round((g + m) * 255)
            b = Math.round((b + m) * 255)
            return [r, g, b]
        },

        RGBtoHEX(rgb) { 
            var rHex = Number(rgb[0]).toString(16);
            var gHex = Number(rgb[1]).toString(16);
            var bHex = Number(rgb[2]).toString(16);
        
            if (rHex.length < 2) {
                rHex = "0" + rHex;
            }
            if (gHex.length < 2) {
                gHex = "0" + gHex;
            }
            if (bHex.length < 2) {
                bHex = "0" + bHex;
            }
            return rHex + gHex + bHex;
        },

        HEXtoRGB (hex) {
            "use strict";
            if (hex.charAt(0) === '#') {
                hex = hex.substr(1);
            }
            if ((hex.length < 2) || (hex.length > 6)) {
                return false;
            }
            var values = hex.split(''),
                r,
                g,
                b;
            if (hex.length == 1){
                r = 0;
                g = 0;
                b = parseInt("0" + hex, 16);
            } else if (hex.length == 2) {
                r = parseInt(values[0].toString() + values[1].toString(), 16);
                g = r;
                b = r;
            } else if (hex.length == 3) {
                r = parseInt(values[0].toString() + values[0].toString(), 16);
                g = parseInt(values[1].toString() + values[1].toString(), 16);
                b = parseInt(values[2].toString() + values[2].toString(), 16);
            } else if (hex.length == 6) {
                r = parseInt(values[0].toString() + values[1].toString(), 16);
                g = parseInt(values[2].toString() + values[3].toString(), 16);
                b = parseInt(values[4].toString() + values[5].toString(), 16);
            } else {
                return false;
            }
            return [r, g, b];
        },

        capitalizeFirstLetter(string){
            return string.charAt(0).toUpperCase() + string.slice(1)
        }
    },
};