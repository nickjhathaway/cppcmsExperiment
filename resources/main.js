// based on example from http://thecodeplayer.com/walkthrough/html5-game-tutorial-make-a-snake-game-using-html5-canvas-jquery

$(document).ready(function(){
	
	var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var mainSeqData, mainData;
    var needToPaint = true;
    var baseColors = {};
    baseColors['A'] = "#ff8787";
    baseColors['G'] = "#ffffaf";
    baseColors['C'] = "#afffaf";
    baseColors['T'] = "#87afff";
   	var width = canvas.width;
    var height = canvas.height;
    var cellWidth = 20;
    var cellHeight = 30;
    var numOfBases = Math.floor((canvas.width - cellWidth)/cellWidth);
	var numOfSeqs = Math.floor((canvas.height - cellHeight)/cellHeight);
	var baseStart = 0;
	var seqStart = 0;
	function setUpCanvas(){
		var canvas = document.getElementById('canvas');
		canvas.width = (window.innerWidth - 10) * 0.98;
		canvas.height = (window.innerHeight - 60) * 0.98;
		numOfBases = Math.floor((canvas.width - cellWidth)/cellWidth);
	 	numOfSeqs = Math.floor((canvas.height - cellHeight)/cellHeight);
	};
	function updateCanvas(){
		var canvas = document.getElementById('canvas');
		var changingHeight = (window.innerHeight - 60) * 0.98;
		var changingWidth = (window.innerWidth - 10) * 0.98;
		canvas.height = changingHeight;
		canvas.width = changingWidth;
		if(changingHeight > canvas.height){
			needToPaint = true;
		}
		if(changingWidth > canvas.width){
			needToPaint = true;
		}
		numOfBases = Math.floor((canvas.width - cellWidth)/cellWidth);
	 	numOfSeqs = Math.floor((canvas.height - cellHeight)/cellHeight);
	};
	function drawCircle(x, y, radius, color, borderColor){
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = borderColor;
        context.stroke();
    }

    function drawLine(sx, sy, ex, ey, width){
        context.beginPath();
        context.moveTo(sx, sy);
        context.lineTo(ex, ey, width);
        context.stroke();
    }

    function ajax(url, func){
        $.ajax({ url: url, dataType: 'json', async: false,
            success: function(ct){ func(ct); } });
    }

    function ajaxAsync(url, func){
        $.ajax({ url: url, dataType: 'json', async: true,
                 success: function(ct){ func(ct); } });
    }


    
    function drawSeq(index, seq, start){
    	context.textAlign = "center";
    	context.textBaseline = "middle";
    	context.font = "bold 15px 'Helvetica Neue',Helvetica, Arial, sans-serif";
    	//wi * cellWidth < canvas.width &&
    	for(var wi = start; wi - start < numOfBases; wi++){
    		//console.log(wi);
            //var randIdx = Math.floor(Math.random() * colors.length);
            //context.fillStyle = colors[randIdx];
            //context.fillStyle ="#203049";
            if(wi < seq.length){
            	context.fillStyle = baseColors[seq[wi]];
            	context.fillRect((wi -start) * cellWidth, index*cellHeight, cellWidth, cellHeight);
            	context.fillStyle = "#000000";
	        	context.fillText(seq[wi], (wi -start)*cellWidth + cellWidth/2.0, index*cellHeight + cellHeight/2.0);
            }else{
            	context.strokeStyle = "#000000";
    			context.lineWidth   = 1;
            	context.fillStyle = "#EEEEEE";
            	context.fillRect((wi -start) * cellWidth, index*cellHeight, cellWidth, cellHeight);
            	context.strokeRect((wi -start) * cellWidth, index*cellHeight, cellWidth, cellHeight);
            }

        }
    };
    //
    function paint(seqData){
    	if(needToPaint){
    		//console.log("painting");
	    	for(var hi = seqStart; hi -seqStart < numOfSeqs ; hi++){
	    		//console.log(hi);
	    		drawSeq(hi - seqStart, seqData[hi]["seq"], baseStart);
	    	}
	    	needToPaint = false;
	    	/*
			$.each(mainSeqData["seqs"], function(i, s) {
		            //console.log(s);
		            
		    });*/
    	}
    }
   function addMouseScrollListener(obj, up, down){
        // from http://www.sitepoint.com/html5-javascript-mouse-wheel/
        this.handler = function(e){
	    var e = window.event || e; // old IE support
	    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            if( delta > 0){
                up(delta);
            } else {
                down(delta);
            }
        };
        if (obj.addEventListener) {
	    // IE9, Chrome, Safari, Opera
	    obj.addEventListener("mousewheel", handler, false);
	    // Firefox
	    obj.addEventListener("DOMMouseScroll", handler, false);
        } else {
            // IE 6/7/8
            obj.attachEvent("onmousewheel", handler);
        }
    }

    function mouseWheelUp(steps){
        if(seqStart > 0){
        	--seqStart;
        	$("#rightSlider").slider('value', mainData["numReads"] - seqStart - numOfSeqs);
        	needToPaint = true;
        	paint(mainSeqData["seqs"]);
        }
    }

    function mouseWheelDown(steps){
        if(seqStart < Math.max(mainData["numReads"]- numOfSeqs, 0)){
        	++seqStart;
        	$("#rightSlider").slider('value', mainData["numReads"] - seqStart - numOfSeqs);
        	needToPaint = true;
        	paint(mainSeqData["seqs"]);
        }
    }
    function setUpSliders(maxSeqs, maxBases){
	    $( "#bottomSlider" ).slider({
	      range: "min",
	      min: 0,
	      max: Math.max(maxBases- numOfBases, 0),
	      value: 0,
	      slide :function(event, ui){
	      	baseStart = ui.value;
	      	paint(mainSeqData["seqs"]);
	      	needToPaint = true;
	      	//console.log(ui.value);
	      	//console.log(baseStart);
	      }
	      });
	    $( "#rightSlider" ).slider({
	      range: "max",
	      min: 0,
	      max: Math.max(maxSeqs- numOfSeqs, 0),
	      value: maxSeqs,
	      orientation: "vertical", slide :function(event, ui){
	      	needToPaint = true;
	      	seqStart = maxSeqs - numOfSeqs - ui.value;
	      	paint(mainSeqData["seqs"]);
	      	//console.log(ui.value);
	      	//console.log(seqStart);
	      }
	    });
    }

	function init(){
		ajax('/evt/mainSeqData', function(msd){ mainSeqData = msd; });
		ajax('/evt/mainData', function(md){ mainData = md; });
		
		$(window).bind("resize", function(){
			updateCanvas();
			paint(mainSeqData["seqs"]);
		});
		setUpCanvas();
		setUpSliders(mainData["numReads"],mainData["maxLen"] );
		paint(mainSeqData["seqs"]);
		console.log(numOfBases);
		console.log(mainData["maxLen"]);
		console.log(mainData["maxLen"] - numOfBases);
		console.log(numOfSeqs);
		console.log(mainData["numReads"]);
		console.log(mainData["numReads"] - numOfSeqs);
		addMouseScrollListener(canvas, mouseWheelUp,mouseWheelDown);
	}
	init();

    function addClickListener(canvas, regions){
        this.getCursorPosition = function(event) {
            // from http://stackoverflow.com/a/5417934
            var canoffset = $(canvas).offset();
            var x = event.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft - Math.floor(canoffset.left);
            var y = event.clientY + document.body.scrollTop +
                document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
            return [x,y];
        };
        this.clickInBBox = function(x, y, bbox){
            var b = bbox;
            // pad
            b[0] -= 5; b[1] -= 5;
            b[2] += 5; b[3] += 5;
            if(x > b[0] && x < b[2] && y > b[1] && y < b[3]){
                return true;
            }
            return false;
        };
        this.clicked = function(e){
            var pt = getCursorPosition(e);
            for(var i = 0; i < regions.length; ++i){
                var name = regions[i][0];
                var bbox = screenBoxes[name];
                if(clickInBBox(pt[0], pt[1], bbox)){
                    regions[i][1]();
                    return;
                }
            }
        };
        canvas.addEventListener("mousedown", clicked, false);
    }

});
