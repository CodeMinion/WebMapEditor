/********************************************************************************
 * Project: HTML 5 Akimo Editor
 * Author : Frank Hernandez
 * Date   : Summer 2011
 * Purpose: Learn about HTML 5 Canvas and JavaScript.
 * Outcome: Canvas are just like any other drawing surfaces that I have 
 *			encountered during game development. 
 *			JavaScript: Interesting, a pain for a certain way of thinking
 *						but good once you get used to it.
 *
 * About the Akimo Map Editor:
 * This was the first project that I completed when I was learning
 * C++. I figured it would be a good choice for learning Canvas.
 * The editor is supposed to allow the creation of maps for the 
 * Akimo game via a drag-and-drop interface. It supports layers
 * for multi-level creation. This version however lacks the 
 * the functionality for exporting maps, as well as the ability 
 * to decided the size of the map you wish to create. It is 
 * after all a lite version to test the waters of HTML 5 Canvas,
 * and Akimo is no longer an active project.
 * It does support drag-and-drop for feeling large areas with 
 * tiles. The multi-layer aspect of the editor is still present
 * as well, allowing to create maps in a layer fashion.
 *
 * Update: Added support for multiple selection areas. 
 *		   Currently a tile can be selected from any 
 *		   avaliable selection area. The Id of the selection
 *		   area the tile came from is stored inside the tile
 *		   itself. This can be used later on during the 
 *		   final export of the map.
 *
 * Update: Added group selection on the selection screen. 
 *		   Now a block of tiles can be selected and placed
 *         map at one time.
 * 
 *
 * Code: Feel free to use the code in your learning endeavors 
 *		 as you see fit, just save me a little section in there
 *       for some credits ;)
 *
 ********************************************************************************/
 
var tileWidth = 32;	// Width in pixels of each individual tile.
var tileHeight = 32; // Height in pixels of the Tiles

var selCanvasId = "selection_canvas";
//var selCanvasId2 = "selection_canvas2";
var selCanvasAmount = 2;

var mapCanvasId = "map_canvas";

var currLayer = 0;
var maxLayers = 7;

function InitEditor()
{
	// Create Selection Area.
	var selection = new SelectionArea("./Images/GrassTileset.png", 32, 32, selCanvasId +"1");
	var selection2 = new SelectionArea("./Images/GrassTileset1.png", 32, 32, selCanvasId + "2");
	
	
	// Create Map Area
	var mapArea = new MapArea("./Images/MapEditorV1.png", 20, 20, tileWidth, tileHeight);
	
	// Initialize the Layer Buttons
	InitLayerBottons();
}
/**
 * This function assigns the event listener to each
 * layer button. The function retrieves every button
 * image from the html document and assigns the event
 * listener function to it.
 */
function InitLayerBottons()
{
   for(var i =0; i < maxLayers; i++)
   {
     var imgElement = document.getElementById("lyr_"+(i+1));
	 if(i ==0)
	 {
	   imgElement.style.border = "red 1px solid";
	 }
	 if(imgElement != undefined)
	 {
	    //Assign onClick
		imgElement.addEventListener("click", OnLayerClick, false);
	 }
   }
}
/**
 * This function handles the OnClick of each layer button.
 * The function uses the index in the end of the layer ID
 * to specify the layer to be selected on the map.
 */
function OnLayerClick()
{
   var id = this.id;
   if(id != undefined)
   {
     var layerNumber = id.charAt(id.length-1);
	 if(layerNumber >0 && layerNumber < maxLayers)
	 {	
		
		var imgElement = document.getElementById("lyr_"+(currLayer+1));
		imgElement.style.border = "red 0px solid";
		currLayer = layerNumber -1;
		imgElement = document.getElementById("lyr_"+(currLayer+1));
		imgElement.style.border = "red 1px solid";
		DrawMapArea(true);
		DrawMapArea(false);
	 }
   }
}

/**
 * Simple recursive function to create an
 * N-Dimensional Array
 * @param arrDimension - Contains the size 
 * 						 of each array to be 
 * 						 created.
 */
function createNDArray(arrDimensions)
{
   if(arrDimensions.length ==1)
     return new Array(arrDimensions[0]);
	 
	var size = arrDimensions[0];
	var x = new Array(size);
	
	// Remove first element of the array.
	var newArrDimensions = arrDimensions.slice(1);
	for(var i =0; i < size; i++)
	{
	  x[i] = createNDArray(newArrDimensions);
	}
	
	return x;
	
}

/**
 * My lame attempt at creating a class in JavaScript.
 * So much for the class oriented way of thinking...
 *
 * In this function the map is initialized the with
 * number of tiles height specified in the mapLength
 * number of tile width specified in mapHeigth.
 * It also layers the map with the defaul background
 * image.
 * @param mapLength - mumber of tiles top to bottom.
 * @param mapHeight - number of tiles left to right.
 * @param tileW - Width of the tile in pixels.
 * @param tileH - Height of the tile in pixels.
 * @param defImgPath - Path to the default image.
 */
function MapArea(defImgPath, mapLength, mapHeight, tileW, tileH)
{
	this.mapLength = mapLength;
	this.mapHeight = mapHeight;
	this.tileW = tileW;
	this.tileH = tileH;
	
	var canvasElement = document.getElementById(mapCanvasId);
	// Give a red border to the canvas.
	canvasElement.style.border = "red 1px solid";
	
	// Calculate canvas width and height in pixels.
	canvasElement.width = mapLength * tileW + mapLength;
	canvasElement.height = mapHeight * tileH + mapHeight;
	
	// Save Tile Dimensions
	canvasElement.tileW = tileW;
	canvasElement.tileH = tileH;
	
	// Number of tiles accross
	canvasElement.areaW = mapLength;
	// Number of tiles top-down
	canvasElement.areaH = mapHeight;
	
	var ctx = canvasElement.getContext("2d");
	
	var img = new Image();
	img.src = defImgPath;
	
	var map2D = createNDArray(new Array(maxLayers, mapHeight, mapLength));
	for( var kkk = 0; kkk < maxLayers; kkk++)
	{
		// Initialize Map 2D Array
		for(var k = 0; k < mapHeight; k++)
		{
			for( var kk = 0; kk < mapLength; kk++)
			{
				map2D[kkk][k][kk] = new Tile(-1, 0,0, k*tileW, kk*tileH, -1);
			}
		}
	}
	canvasElement.map2D = map2D;
	// Save the bg image
	canvasElement.img = img;
	// Save Map Dimensions
	canvasElement.mapLength = mapLength;
	canvasElement.mapHeight = mapHeight;
	
	img.onload = function()
	{
		DrawMapArea(false);
	};

	// Assign OnMouseDown Function.
	canvasElement.onmousedown = MapDragBegin;
	// Assign OnMouseUp Function.
	canvasElement.onmouseup = MapDragEnd;
	
}
/** 
 * This function handles the OnMouseDown event.
 * It simply stores the position of the mouse when
 * the button was pressed.
 */
function MapDragBegin(e)
{
  var canvas = document.getElementById(mapCanvasId);
  HandleSelected(e, canvas);
}
/**
 * This function handles the MouseUp event. On mouse up, it retrives 
 * the position of the mouse and builds a rectangle with the initial
 * mouse position obtained in MapDragBegin function.
 * it then places the selected tile from the selction canvas into 
 * every tile in the map that falls inside the rectangle.
 *
 * Note: In the event of a single click the previous and last positions
 * 		 of the mouse will be the same, giving a retangle whose size 
 *		 equals to a single tile. Therefore only one tile will be placed.
 */
function MapDragEnd(e)
{
	var mapCanvas = document.getElementById(mapCanvasId);
	var selCanvas = document.getElementById(mapCanvas.activeCanvasId);//document.getElementById(selCanvasId);

	if(selCanvas.selectedX != undefined && selCanvas.selectedY != undefined)
	{
		var startRow = Math.floor(mapCanvas.selectedX / (mapCanvas.tileW+1));
		var startCol = Math.floor(mapCanvas.selectedY / (mapCanvas.tileH+1));
		
		HandleSelected(e, mapCanvas);
		var endRow = Math.floor(mapCanvas.selectedX / (mapCanvas.tileW+1));
		var endCol = Math.floor(mapCanvas.selectedY / (mapCanvas.tileH+1));
		
		var temp = 0;
		if(startRow > endRow)
		{
		   temp = startRow;
		   startRow = endRow;
		   endRow = temp;
		   
		}
		if(startCol > endCol)
		{
		   temp = startCol;
		   startCol = endCol;
		   endCol = temp;
		   
		}
		
		var sx = selCanvas.selectedX/(selCanvas.tileW+1)*selCanvas.tileW;
		var sy = selCanvas.selectedY/(selCanvas.tileH+1)*selCanvas.tileH;
		
		var k = 0;
		var kk = 0;
		for(var i = startCol; i < mapCanvas.mapHeight && i <= endCol; i++)
		{
			k = 0;
		   for(var j = startRow; j < mapCanvas.mapLength && j <= endRow; j++)
		   {
			
				var tileId = calculateTileId(sx + (k * selCanvas.tileW), sy + (kk * selCanvas.tileH ), 
											selCanvas.tileW, selCanvas.tileH, selCanvas.mapLength);
				mapCanvas.map2D[currLayer][j][i] = 
				new Tile(tileId, sx + (k * selCanvas.tileW) ,sy + (kk * selCanvas.tileH), 
				j*(mapCanvas.tileW+1), i*(mapCanvas.tileH+1), mapCanvas.activeCanvasId);
				
				k = (k +1)% selCanvas.selLength;
		   }
		   kk = (kk +1)% selCanvas.selHeight;
		}
		// Clear the map to the default background image.
		// Done to diplay invisible tiles as default tiles
		// in level 0.
		DrawMapArea(true);
		// Draw the map.
		DrawMapArea(false);
	}
	
}
/**
* This function will either clear the map or draw the tiles according to
* their tile ID and src/dest pos.
* @param clearMap - true if this call should clear the map area instead 
* 					of drawing. Rather than having a separate function
*					with almost the same logic as this one just for 
*					clear, I used a flag instead. 
*					Lazyness wins onces again!!
*/
function DrawMapArea(clearMap)
{
	// Get the map canvas from the html page.
	var mapCanvas = document.getElementById(mapCanvasId);
	// Get the selection canvas from the html page.
	var selectionCanvas = document.getElementById(mapCanvas.activeCanvasId);
	// Calculate the bagground width for the default image.
	var bgWidth = Math.floor(mapCanvas.img.width / mapCanvas.tileW);
	// Calculate the background height for the default image.
	var bgHeight = Math.floor(mapCanvas.img.height / mapCanvas.tileH);
	// Get the context from the map canvas to begin drawing.
	var ctx = mapCanvas.getContext("2d");
	// Paint layer starting at layer 0 in increasing order.
	for( var k = 0; k < maxLayers && k <= currLayer ; k++)
	{
		for(var i =0; i < mapCanvas.mapLength; i++)
		{
			for(var j = 0; j < mapCanvas.mapHeight; j++)
			{
				var tile = mapCanvas.map2D[k][i][j];
				// If no id is set, use the editor's default background.
				if(tile.tileID == -1 || clearMap == true)
				{
					var sx = i % bgWidth;
					var sy = j % bgHeight;
					var dx = i;
					var dy = j;
					ctx.drawImage(mapCanvas.img, 
									sx*mapCanvas.tileW, 
									sy*mapCanvas.tileH, 
									mapCanvas.tileW, 
									mapCanvas.tileH, 
									dx*mapCanvas.tileW+i, 
									dy*mapCanvas.tileH+j, 
									mapCanvas.tileW, 
									mapCanvas.tileW);
				}
				// If it has a tile ID then use the image from the selection canvas.
				else if( tile.tileID != undefined && tile.tileID >=0)
				{
					selectionCanvas = document.getElementById(tile.sCanvasId);
					ctx.drawImage(selectionCanvas.img, 
									tile.sx, 
									tile.sy, 
									mapCanvas.tileW, 
									mapCanvas.tileH, 
									tile.dx, 
									tile.dy, 
									mapCanvas.tileW, 
									mapCanvas.tileW);
				
				}
			}
		}
	}
}
/**
 * Another class creation attempt...
 *
 * This function create the selction layer.
 * It stores the tile and image information 
 * in the selection canvas. 
 * @param imagePath - path to the image to use.
 * @param tileW - Width in pixels of the tile.
 * @param tileH - Height in pixels of the tile.
 */
function SelectionArea(imagePath, tileW, tileH, canvasId)
{
	var img = new Image();
	img.src = imagePath;
	
	this.tileW = tileW;
	this.tileH = tileH;
   
	// Create the canvas
	//var canvasElement = document.getElementById(selCanvasId);
	var canvasElement = document.getElementById(canvasId);
	// Add Border To Canvas
	canvasElement.style.border = "red 1px solid";
	// Store Image Object on Canvas
	canvasElement.img = img;
	// Save Tile Dimensions
	canvasElement.tileW = tileW;
	canvasElement.tileH = tileH;
		
	// Get the drawing context to be able to draw to the canvas.
	var drawingContext = canvasElement.getContext("2d");
	
	img.onload = function()
	{
		canvasElement.mapLength = img.width / tileW;
		canvasElement.mapHeight = img.height / tileH;
		DrawSelectionArea(canvasId);
	};
	// Add OnClick Listener to the Canvas
	//canvasElement.addEventListener("click", SelectionAreaOnClick, false);
	canvasElement.onmousedown = SelectionAreaDragBegin;
	canvasElement.onmouseup = SelectionAreaDragEnd;
}
/**
 * This function handles the drawing of the Selection Area.
 * The selection area contains the tile to be used in the 
 * creation of the map. 
 */
function DrawSelectionArea(canvasId)
{
		//var canvasElement = document.getElementById(selCanvasId);
		var canvasElement = document.getElementById(canvasId);
		// Set Dimensions for Canvas;
		canvasElement.width = canvasElement.img.width + canvasElement.img.width / canvasElement.tileW;
		canvasElement.height = canvasElement.img.height + canvasElement.img.height / canvasElement.tileH;
		
		var rowLength = canvasElement.img.width / canvasElement.tileW;
		var colLength = canvasElement.img.height / canvasElement.tileH;
		
		// Number of tiles accross
		canvasElement.areaW = rowLength;
		// Number of tiles top-down
		canvasElement.areaH = colLength;
	
		// Get the drawing context to be able to draw to the canvas.
		var drawingContext = canvasElement.getContext("2d");
		
		for(var j = 0; j < rowLength; j++)
		{
			for(var i =0; i < colLength; i++)
			{
				sx = j; 
				sy = i;
				//Signature : IMG_OBJ, SX, SY, SW, SH, DX, DY, DW, DH)
				drawingContext.drawImage(canvasElement.img, 
										sx*canvasElement.tileW, 
										sy*canvasElement.tileH, 
										canvasElement.tileW, 
										canvasElement.tileH, 
										sx*canvasElement.tileW+j, 
										sy*canvasElement.tileH+i, 
										canvasElement.tileW, 
										canvasElement.tileW);
			}
		}
}

/** 
 * This function delegates the onMouseDown 
 * for the canvas with Id specified in selCanvasId
 * to SelectionAreaDragBeginHlp(e, canvasId).
 */
function SelectionAreaDragBegin(e)
{
	var id = this.id;
	if(id != undefined)
	{
		ClearSelectionMaskFromCanvas();
		SelectionAreaDragBeginHlp(e, id);
	}
}
/**
 * This function iterates through all the canvas and 
 * clears and paints them. Used to remove the selection
 * mask from the canvas that are not being used.
 */
function ClearSelectionMaskFromCanvas()
{
	for(var i = 1; i <= selCanvasAmount; i++)
	{
		var canvasElement = document.getElementById(selCanvasId + "" +i);
		var ctx = canvasElement.getContext("2d");
		ctx.clearRect(0,0, canvasElement.width, canvasElement.height);
		DrawSelectionArea(selCanvasId + "" +i);
	}
}
/**
 * This function handles the OnMouseDown of the selection canvas.
 * This function simply registers the X and Y positions of the 
 * mouse click.
 */
function SelectionAreaDragBeginHlp(e, canvasId)
{
  var canvas = document.getElementById(canvasId);
  var mapCanvas = document.getElementById(mapCanvasId);
  mapCanvas.activeCanvasId = canvasId;
  HandleSelected(e, canvas);

}
/** 
 * This function delegates the onMouseUp 
 * for the canvas with Id specified in selCanvasId
 * to SelectionAreaDragBeginHlp(e, canvasId).
 */
function SelectionAreaDragEnd(e)
{
	var id = this.id;
	if(id != undefined)
	{
		SelectionAreaDragEndHlp(e, id);
	}
}
/** 
 * This function handles the OnMouseDown of the selection canvas.
 * This function draws a selection mask over every selected tile.
 * This function also stores the folowing values in the canvas.
 * 	selCanvas.startX - Start Index in the X
 *	selCanvas.startY - Start Index in the Y
 *	selCanvas.selLength - Total number of tiles selected accros.
 *	selCanvas.selHeight = Total number of tiles selected top-down
 */
function SelectionAreaDragEndHlp(e, canvasId)
{
	//var selCanvas = document.getElementById(selCanvasId);
	var selCanvas = document.getElementById(canvasId);
	if(selCanvas.selectedX != undefined && selCanvas.selectedY != undefined)
	{
		var startX = selCanvas.selectedX/(selCanvas.tileW+1);
		var startY = selCanvas.selectedY/(selCanvas.tileH+1);
		
		HandleSelected(e, selCanvas);
		var endX = selCanvas.selectedX/(selCanvas.tileW +1);
		var endY = selCanvas.selectedY/(selCanvas.tileH +1);
		
		if(endX < startX)
		{
			var temp = endX;
			endX = startX;
			startX = temp;
		}
		
		if(endY < startY)
		{
			var temp = endY;
			endY = startY;
			startY = endY;
		}
		
		var totalSelX = (endX - startX +1);
		var totalSelY = (endY - startY +1);
		
		// Store Selection Information in the canvas.
		// Now we store the selection's start index
		// and the total number of tiles accross and 
		// up-down.
		selCanvas.startX = startX;
		selCanvas.startY = startY;
		selCanvas.selLength = totalSelX;
		selCanvas.selHeight = totalSelY;
		
		selCanvas.selectedX = startX * (selCanvas.tileW+1);
		selCanvas.selectedY = startY * (selCanvas.tileH+1);
		
		var ctx = selCanvas.getContext("2d");
		// Clear the Canvas on new selection.
		ctx.clearRect(0,0, selCanvas.width, selCanvas.height);
		// Redraw Selection
		DrawSelectionArea(canvasId);
		ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
		for(var i = startX; i <= endX  && i < selCanvas.mapLength; i++)
		{
			for(var j = startY; j<= endY && j <selCanvas.mapHeight; j++)
			{
				ctx.fillRect(i * (selCanvas.tileW+1) , j * (selCanvas.tileH+1),  selCanvas.tileW, selCanvas.tileH);
			}
		}
		// Draw a selection mask on the selected tile.
		//ctx.fillRect(startX*selCanvas.tileW , startY * selCanvas.tileH,  totalSelX* selCanvas.tileW, totalSelY*selCanvas.tileH);
	}
}
/**
 * This function finds the position of the mouse inside the 
 * canvas specified in Canvas. Upon execution it stores the 
 * relative X and Y position of the mouse inside the canva's
 * selectedX and selectedY variables. This final position 
 * accounts for the extra speration pixel I placed in 
 * between the each tile.
 *
**/ 
function HandleSelected(e, canvas) 
{
  
	var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) 
	{
		x = e.pageX;
		y = e.pageY;
    }
    else 
	{
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
	
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	
	var currentElement = canvas;
	do
	{
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
	}
    while(currentElement = currentElement.offsetParent)
	
	x -= totalOffsetX;
	y -= totalOffsetY; 
	
	x = Math.min(x, (canvas.tileW+1) * canvas.areaW);
    y = Math.min(y, (canvas.tileH+1) * canvas.areaH);
	
	x = Math.floor(x / (canvas.tileW+1));
	y = Math.floor(y / (canvas.tileH+1));
	
	// Store the XY - positions of the selected tile.
	// Since the positions are relative to the canvas
	// these can be used as the source XY of the image
	// in the selection image.
	canvas.selectedX = x * (canvas.tileW+1);	
	canvas.selectedY = y * (canvas.tileH+1);	// Since my tiles have a separation of 1px, 
												// they must be treated as being 1px large 
												// than they actually are.
												
}
/**
 * Tile "Class"
 *
 * Represent an individual tile.
 * @param tileID - Id of the tile.
 * @param sx - X Position in pixels in the source image.
 * @param sy - Y Position in pixels in the source image.
 * @param dx - X Position in the destination screen (Used In Game).
 * @param dy - Y Position in the destination screen (Used In Game).
 * @param canvasId - Id of the canvas this tile originates from.
 */
function Tile(tileID, sx, sy, dx, dy, sCanvasId)
{
	this.tileID = tileID;
	this.sx = sx;
	this.sy = sy;
	this.dx = dx;
	this.dy = dy;
	this.sCanvasId = sCanvasId;
}
/**
 * This function calculates the tile id for a give tile.
 * The tile id is calculated based on the position of the tile.
 * Tile Id's start at 0 and are assigned to each tile in 
 * increating order from left to right.
 *
 * Sample Source Image Tile IDs :
 *  -----------
 * | 0 | 1 | 2 |
 *  -----------
 * | 3 | 4 | 5 |
 *  -----------
 *
 * @param sx - X Position in pixels in the source image.
 * @param sy - Y Position in pixels in the source image.
 * @param sw - Width in pixels of the tile in the source image.
 * @param sh - Height in pixels of the tile in the source image.
 * @param totalTilesAccross - Number of tiles accross the source image.
 */ 
function calculateTileId(sx, sy, sw, sh, totalTilesAccross)
{
  var tileId = Math.floor(sy/sh* totalTilesAccross + sx/sw);
				
  return tileId;
}
