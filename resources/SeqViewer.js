var range = function(start, end, step) {
	// from http://stackoverflow.com/questions/3895478/does-javascript-have-a-range-equivalent
    var range = [];
    var typeofStart = typeof start;
    var typeofEnd = typeof end;

    if (step === 0) {
        throw TypeError("Step cannot be zero.");
    }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
        throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
        throw TypeError("Start and end arguments must be of same type.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
        step = -step;
    }

    if (typeofStart == "number") {

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

    } else if (typeofStart == "string") {

        if (start.length != 1 || end.length != 1) {
            throw TypeError("Only strings with one character are supported.");
        }

        start = start.charCodeAt(0);
        end = end.charCodeAt(0);

        while (step > 0 ? end >= start : end <= start) {
            range.push(String.fromCharCode(start));
            start += step;
        }

    } else {
        throw TypeError("Only string and number types are supported");
    }

    return range;

};
	function createTable(divId) {
		//create the table and return it to be manipulate
		var table = d3.select(divId).append("table");
		table.append("thead").append("tr");
		table.append("tbody");
		return table;
	}
	function updateTable(tab, data, columns){
		
		//ensure header row
		var headerRow = tab.select("thead")
			.selectAll("tr")
			.data([1])
			.enter();
		//attach column name data to header
		var header = tab.select("thead").select("tr")
	        .selectAll("th")
	        .data(columns).text(function(column) { return column; });
	    header
	        .enter()
			.append("th")
				.attr("style", "font-weight: bold; padding: 2px 4px;")
	            .text(function(column) { return column; });
	   //create headers as needed and add bolding 
	  /*header.enter()
	        .append("th")*/
	            
	  //remove any headers that don't have data attached to them
	  console.log(columns);
	  header.exit()
        	.remove();
		var currentColor = "#e9e9e9";
	    // create a row for each object in the data
	    var newRows = tab.select("tbody").selectAll("tr")
	        .data(data)
	        .enter()
	        .append("tr")
	        	.style("background-color",function(d,i){
	        		if(i == 0){
	        			return currentColor;
	        		}else {
	        			if (d[columns[0]] != data[i-1][columns[0]]){
	        				if(currentColor == "#e9e9e9"){
	        					currentColor = "#c9c9c9";
	        				}else{
	        					currentColor = "#e9e9e9";
	        				}
	        			}
	        		}
	        		return currentColor;
	        		});
		var rows = tab.select("tbody").selectAll("tr");
	    //create a cell in each row for each column
	    //console.log(rows);
	    var cells = rows.selectAll("td")
	        .data(function(row) {
	        	var ret = columns.map(function(column) {
	                return {column: column, value: row[column]};
	            });         
	            return ret;
	            
	        });
	   	cells.enter()
	        .append("td")
	            .attr("style", "padding: 2px 4px;")
	            .text(function(d) { return d.value; });
	    cells.text(function(d) { return d.value; });
	    //remove cells as needed
	    cells.exit()
        	.remove();
	}
	function tabulate(data, columns, divId) {
		//adapted from http://stackoverflow.com/questions/9268645/creating-a-table-linked-to-a-csv-file
	    var table = d3.select(divId).append("table"),
	        thead = table.append("thead"),
	        tbody = table.append("tbody");
	
	    // append the header row
	    thead.append("tr")
	        .selectAll("th")
	        .data(columns)
	        .enter()
	        .append("th")
	            .attr("style", "font-weight: bold; padding: 2px 4px;")
	            .text(function(column) { return column; });
	
	    // create a row for each object in the data
	    var rows = tbody.selectAll("tr")
	        .data(data)
	        .enter()
	        .append("tr");
	
	    // create a cell in each row for each column
	    var cells = rows.selectAll("td")
	        .data(function(row) {
	            return columns.map(function(column) {
	                return {column: column, value: row[column]};
	            });
	        })
	        .enter()
	        .append("td")
	            .attr("style", "padding: 2px 4px;")
	            .text(function(d) { return d.value; });
	    
	    return table;
	}
	function updateTableColWise(tab, data, columns){
		//ensure header row
		var headerRow = tab.select("thead")
			.selectAll("tr")
			.data([1])
			.enter()
			.append("tr");
		//attach column name data to header
		var header = tab.select("thead").select("tr")
	        .selectAll("th")
	        .data(columns);
	   //create headers as needed and add bolding 
	  header.enter()
	        .append("th")
	            .attr("style", "font-weight: bold; padding: 2px 4px;")
	            .text(function(column) { return column; });
	  //remove any headers that don't have data attached to them
	  header.exit()
        	.remove();
	
	    // create a row for each object in the data
	    var newRows = tab.select("tbody").selectAll("tr")
	        .data(range(0,data[columns[0]].length - 1))
	        .enter()
	        .append("tr")
	        	.style("background-color", "#e9e9e9");
		var rows = tab.select("tbody").selectAll("tr");
	    //create a cell in each row for each column
	    //console.log(rows);
	   var cells = rows.selectAll("td")
	        .data(data);
	        	/*function(row) {
	        	var rowDat = {};
	        	for(var c in columns){
	        		console.log(c);
	        		console.log(row);
	        		rowDat[c] = (data[columns[c]][row]);
	        	}
	        	console.log(rowDat);
	        	return rowDat;
	            });*/
	        
	   	cells.enter()
	         .append("td")
	            .attr("style", "padding: 2px 4px;")
	            .text(function(d) { return d.value; });
	    //remove cells as needed
	    cells.exit()
        	.remove();
	}
	function tabulateColwise(data, columns, divId) {
		//adapted from http://stackoverflow.com/questions/9268645/creating-a-table-linked-to-a-csv-file
	    var table = d3.select(divId).append("table"),
	        thead = table.append("thead"),
	        tbody = table.append("tbody");
	
	    // append the header row
	    thead.append("tr")
	        .selectAll("th")
	        .data(columns)
	        .enter()
	        .append("th")
	            .attr("style", "font-weight: bold; padding: 2px 4px;")
	            .text(function(column) { return column; });
	
	    // create a row for each object in the data
	    var rows = tbody.selectAll("tr")
	        .data(data)
	        .enter()
	        .append("tr");
	
	    // create a cell in each row for each column
	    var cells = rows.selectAll("td")
	        .data(function(row) {
	            return columns.map(function(column) {
	                return {column: column, value: row[column]};
	            });
	        })
	        .enter()
	        .append("td")
	            .attr("style", "padding: 2px 4px;")
	            .text(function(d) { return d.value; });
	    
	    return table;
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
         e.preventDefault();
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
    
    var getRelCursorPosition = function(event, obj ) {
        // from http://stackoverflow.com/a/5417934
        var canoffset = $(obj).offset();
        var x = event.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft - Math.floor(canoffset.left);
        var y = event.clientY + document.body.scrollTop +
            document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
        return [x,y];
    };
    
	function Canvas(i){
        this.canvas = $(i)[0];
        this.context = this.canvas.getContext("2d");
    }
	
	function SeqPainter(cellWidth, cellHeight, numOfSeqs, numOfBases, nameOffSet, baseColors){
		this.needToPaint = true;
		this.cw = cellWidth;
		this.ch = cellHeight;
		this.nSeqs = numOfSeqs;
		this.nBases = numOfBases;
		this.bColors = baseColors;
		this.nameOffSet = nameOffSet;
	}
	
	//draw given seq
	SeqPainter.prototype.paintSeq = function(seqContext, index, seq, start){
    	seqContext.textAlign = "center";
    	seqContext.textBaseline = "middle";
    	seqContext.font = "bold 15px Arial, sans-serif";
    	for(var wi = start; wi - start < this.nBases; wi++){
            if(wi < seq.length){
            	seqContext.fillStyle = this.bColors[seq[wi]];
            	seqContext.fillRect((wi - start) * this.cw + this.nameOffSet, index*this.ch, this.cw, this.ch);
            	seqContext.fillStyle = "#000000";
	        	seqContext.fillText(seq[wi], (wi -start)*this.cw + this.cw/2.0 + this.nameOffSet, index*this.ch + this.ch/2.0);
            }else{
            	seqContext.strokeStyle = "#000000";
    			seqContext.lineWidth   = 1;
            	seqContext.fillStyle = "#EEEEEE";
            	seqContext.fillRect((wi -start) * this.cw + this.nameOffSet, index*this.ch, this.cw, this.ch);
            	seqContext.strokeRect((wi -start) * this.cw + this.nameOffSet, index*this.ch, this.cw, this.ch);
            }
        }
	};
	
	//draw all necessary seqs
	SeqPainter.prototype.paintSeqs = function(seqContext, seqData, sStart, bStart){
    	if(this.needToPaint){
    		//console.log("painting");
    		//box around seqs
    		seqContext.strokeStyle = "#000000";
			seqContext.lineWidth   = 1;
	    	seqContext.strokeRect(this.nameOffSet, 0,this.cw * this.nBases,
	    		 Math.min(this.ch * this.nSeqs,this.ch * seqData.length ));
	    	//write names
	    	seqContext.textAlign = "left";
	    	seqContext.textBaseline = "middle";
	    	seqContext.font = "bold 15px Arial, sans-serif";
	        seqContext.strokeStyle = "#000000";
			seqContext.lineWidth   = 1;
	    	for(var hi = sStart;( hi -sStart < this.nSeqs ) && (hi < seqData.length); hi++){
	    		console.log(hi);
	    		console.log(this.nSeqs);
	    		seqContext.fillStyle = "#EEEEEE";
		    	seqContext.fillRect(0, (hi - sStart)*this.ch, this.nameOffSet, this.ch);
		    	seqContext.strokeRect(0, (hi - sStart)*this.ch, this.nameOffSet, this.ch);
		    	seqContext.fillStyle = "#000000";
				seqContext.fillText(seqData[hi]["name"], 2, (hi - sStart)*this.ch + this.ch/2.0);
	    	}	    	
	    	for(var hi = sStart;( hi -sStart < this.nSeqs ) && (hi < seqData.length) ; hi++){
	    		this.paintSeq(seqContext, hi - sStart,
	    		 seqData[hi]["seq"], bStart);
	    	}
	    	this.needToPaint = false;
	    	//console.log("end-painting");
    	}
	};
	//paint seq position
	SeqPainter.prototype.placeBasePos = function(seqContext, sStart, bStart){
    	seqContext.textAlign = "center";
    	seqContext.textBaseline = "middle";
    	seqContext.fillStyle = "#EEEEEE";
	    seqContext.fillRect(this.nameOffSet - this.cw, (this.nSeqs)*this.ch + 2 , this.cw * 2, this.ch);
	    seqContext.fillRect(this.nameOffSet - this.cw + this.nBases * this.cw -this.cw, (this.nSeqs)*this.ch + 2 , this.cw * 2, this.ch);
	    seqContext.fillRect(this.nameOffSet + this.nBases * this.cw + 2, 0 , this.cw * 2, this.ch);
	    seqContext.fillRect(this.nameOffSet + this.nBases * this.cw + 2, (this.nSeqs)*this.ch - this.ch , this.cw * 2, this.ch);
	    seqContext.fillStyle = "#000000";
    	seqContext.font = "bold 15px Arial, sans-serif";
      	seqContext.fillText(bStart, this.nameOffSet, (this.nSeqs)*this.ch +2 + this.ch/2.0);
      	seqContext.fillText(bStart + this.nBases -1, this.nameOffSet + this.nBases * this.cw -this.cw, (this.nSeqs)*this.ch +2 + this.ch/2.0);
   		seqContext.fillText(sStart, this.nameOffSet + this.nBases * this.cw + this.cw + 2, this.ch/2.0  );
   		seqContext.fillText(sStart + this.nSeqs - 1, this.nameOffSet + this.nBases * this.cw + this.cw + 2, (this.nSeqs)*this.ch - this.ch+ this.ch/2.0  );
   };
   
   SeqPainter.prototype.paintSelectedSeq = function(seqContext,seq, currentBase){
   		seqContext.font = "bold 15px Arial, sans-serif";
   		seqContext.textAlign = "left";
    	seqContext.textBaseline = "middle";
   		var logInfo = "name: " + 
        	seq["name"]
        	+ " base: "  + seq["seq"][currentBase] 
        	+ " qual: " +  seq["qual"][currentBase]
        	+ " pos: " + currentBase;
        var tWidth = seqContext.measureText(logInfo).width;
        seqContext.fillStyle = "#FFFFFF";
	    seqContext.fillRect(this.nameOffSet + this.cw + 2, (this.nSeqs)*this.ch + 2 , this.nBases * this.cw, this.ch);
        seqContext.fillStyle = "#EEEEEE";
	    seqContext.fillRect(this.nameOffSet + this.cw + 2, (this.nSeqs)*this.ch + 2 , tWidth, this.ch);
	    seqContext.fillStyle = "#000000";
	    console.log(tWidth);
	    seqContext.fillText(logInfo,this.nameOffSet + this.cw + 2, (this.nSeqs)*this.ch + 2  + this.ch/2 );
	    
   };
	
	function SeqView(viewName, seqs, seqData, cellWidth, cellHeight, baseColors, qualChartName){
		//need to add style and html, currently just there
		//retrieve html elements 
		this.masterDiv = document.getElementById(viewName);
		this.canvas = $("#canvas", this.masterDiv)[0];
		this.context = this.canvas.getContext('2d');
		this.rSlider = $("#rightSlider", this.masterDiv)[0];
		this.bSlider = $("#bottomSlider", this.masterDiv)[0];
		this.popUp = $("#pop-up", this.masterDiv)[0];
		this.sel = $("#select", this.masterDiv)[0];
		// set up of sizes
		$(this.masterDiv).width((window.innerWidth - 10) * 0.98);
		$(this.masterDiv).height((window.innerHeight - 60) * 0.98);
		this.canvas.width = $(this.masterDiv).width() * 0.98;
		this.canvas.height = $(this.masterDiv).height() * 0.95;
		var nameOffSet = 10 * cellWidth;
		var numOfBases = Math.floor((this.canvas.width - cellWidth - nameOffSet)/cellWidth);
	 	var numOfSeqs = Math.min(Math.floor((this.canvas.height - cellHeight)/cellHeight), seqs.length);
	 	console.log(numOfSeqs);
	 	console.log(Math.floor((this.canvas.height - cellHeight)/cellHeight));
	 	console.log(seqs.length);
		this.painter = new SeqPainter(cellWidth, cellHeight, numOfSeqs, numOfBases, nameOffSet, baseColors);
		this.seqs = seqs;
		this.seqData = seqData;
		this.seqStart = 0;
		this.baseStart = 0;
		this.currentSeq = 0;
		this.currentBase = 0;
		this.chart = c3.generate({
			bindto: 'qualChartName',
		    data: {
		        json: {
		            qual: this.seqs[this.currentSeq]["qual"]
		        }
		    }, 
			grid: {
		        y: {
		            lines: [{value: 20}]
		        }
		    }
		});
		//
	};
	
	SeqView.prototype.setUp = function(){
		this.setUpCanvas();
		this.setUpSliders();
		this.setUpListeners();
		this.setSelector();
	};
	
	SeqView.prototype.setUpCanvas = function(){
		$(this.masterDiv).width((window.innerWidth - 10) * 0.98);
		var maxPossHeight = this.painter.ch * (this.seqs.length + 4);
		$(this.masterDiv).height(Math.min((window.innerHeight - 60) * 0.80, maxPossHeight));
		this.canvas.width = $(this.masterDiv).width() * 0.96;
		this.canvas.height = $(this.masterDiv).height() * 0.95;
		this.painter.nBases = Math.floor((this.canvas.width - this.painter.cw - this.painter.nameOffSet)/this.painter.cw);
	 	this.painter.nSeqs = Math.min(Math.floor((this.canvas.height - this.painter.ch)/this.painter.ch),this.seqs.length);
	};
	
	SeqView.prototype.updateCanvas = function(){
		var changingHeight = (window.innerHeight - 60) * 0.80;
		var changingWidth = (window.innerWidth - 10) * 0.98;
		$(this.masterDiv).width((window.innerWidth - 10) * 0.98);
		var maxPossHeight = this.painter.ch * (this.seqs.length + 4);
		$(this.masterDiv).height(Math.min((window.innerHeight - 60) * 0.80, maxPossHeight));
		this.canvas.width = $(this.masterDiv).width() * 0.96;
		this.canvas.height = $(this.masterDiv).height() * 0.95;
		if(changingHeight > this.canvas.height){
			this.painter.needToPaint = true;
		}
		if(changingWidth > this.canvas.width){
			this.painter.needToPaint = true;
		}
		this.painter.nBases = Math.floor((this.canvas.width - this.painter.cw - this.painter.nameOffSet)/this.painter.cw);
	 	this.painter.nSeqs = Math.floor((this.canvas.height - this.painter.ch)/this.painter.ch);
	};

	SeqView.prototype.paint = function(){
		this.painter.paintSeqs(this.context, this.seqs, this.seqStart, this.baseStart);
		this.painter.placeBasePos(this.context, this.seqStart, this.baseStart);
		this.paintSelectedSeq();
		this.setSelector();
	};
	
	SeqView.prototype.paintSelectedSeq = function(){
		this.painter.paintSelectedSeq(this.context, this.seqs[this.currentSeq], this.currentBase );
	};
	
	SeqView.prototype.setSelector = function(){
		if(this.currentBase >= this.baseStart && this.currentSeq >=this.seqStart){
			$(this.sel).css('top', (this.currentSeq -this.seqStart) *this.painter.ch -1);
			$(this.sel).css('left', (this.currentBase - this.baseStart) *this.painter.cw + this.painter.nameOffSet -1);
			$(this.sel).show();
		}else{
			$(this.sel).hide();
		}
		/*console.log("setSelector");
		console.log(this.sel);
		console.log(this.currentBase);
		console.log(this.currentSeq );
		console.log(this.currentSeq *this.painter.ch);
		console.log(this.currentBase *this.painter.cw + this.painter.nameOffSet );*/
	};
	
    SeqView.prototype.mouseWheelUp = function(steps){
        if(this.seqStart > 0){
        	--this.seqStart;
        	$(this.rSlider).slider('value', this.seqData["numReads"] - this.seqStart - this.painter.nSeqs);
        	this.painter.needToPaint = true;
        	this.paint();
        }
    };

    SeqView.prototype.mouseWheelDown = function(steps){
        if(this.seqStart < Math.max(this.seqData["numReads"]- this.painter.nSeqs, 0)){
        	++this.seqStart;
        	$(this.rSlider).slider('value', this.seqData["numReads"] - this.seqStart - this.painter.nSeqs);
        	this.painter.needToPaint = true;
        	this.paint();
        }
    };
    
	SeqView.prototype.setUpSliders = function(){
    	$( this.bSlider ).css("left", this.painter.nameOffSet);
    	$( this.bSlider).css("width", this.painter.nBases * this.painter.cw);
    	$( this.rSlider ).css("height", this.painter.nSeqs * this.painter.ch);
	    $( this.bSlider).slider({
	      range: "min",
	      min: 0,
	      max: Math.max(this.seqData["maxLen"] - this.painter.nBases, 0),
	      value: 0,
	      slide :function(event, ui){
	      	this.baseStart = ui.value;
	      	this.painter.needToPaint = true;
	      	this.paint();
	      }.bind(this)
	      }).bind(this);
	    $( this.rSlider ).slider({
	      range: "max",
	      min: 0,
	      max: Math.max(this.seqData["numReads"]- this.painter.nSeqs, 0),
	      value: this.seqData["numReads"],
	      orientation: "vertical", slide :function(event, ui){
	      	this.painter.needToPaint = true;
	      	this.seqStart = this.seqData["numReads"] - this.painter.nSeqs - ui.value;
	      	this.paint();
	      }.bind(this)
	    }).bind(this);
   };
   SeqView.prototype.clicked = function(e){
        var pt = getRelCursorPosition(e, this.canvas);
        this.currentBase = Math.ceil(pt[0]/this.painter.cw) - this.painter.nameOffSet/this.painter.cw + this.baseStart -1;
        this.currentSeq = Math.ceil(pt[1]/this.painter.ch) + this.seqStart - 1;
        this.paintSelectedSeq();
        console.log(pt);
        console.log(this.currentSeq);
        console.log(this.currentBase);
        console.log(this.seqs[this.currentSeq]["name"]);
        console.log(this.seqs[this.currentSeq]["seq"][this.currentBase]);
        console.log(this.seqs[this.currentSeq]["qual"][this.currentBase]);
        this.setSelector();
        var currentQual = this.seqs[this.currentSeq]["qual"];
		this.chart.load({
	        json: {
	            qual: this.seqs[this.currentSeq]["qual"]
	        }
	    });

    };
   SeqView.prototype.setUpListeners = function(){
   	// add scrolling listener
   	addMouseScrollListener(this.canvas, this.mouseWheelUp.bind(this), this.mouseWheelDown.bind(this));
   	this.canvas.addEventListener("mousedown", this.clicked.bind(this), false);
	//add hover box listening 
	var moveLeft = 20;
    var moveDown = 10;
    //object.hover(function(e) {
    $(this.canvas).hover(function(e) {
      //fadeInBox.fadeIn(500);
      $(this.popUp).fadeIn(500);
      //.css('top', e.pageY + moveDown)
      //.css('left', e.pageX + moveLeft)
      //.appendTo('body');
    }, function() {
      //fadeInBox.hide();
      $(this.popUp).hide();
    }).bind(this);
    var popUpWindow = this.popUp;
    //var painter = this.painter;
    //var seqs = this.seqs;
    //var seqStart = this.seqStart;
    //var baseStart = this.baseStart;
    $(this.canvas).mousemove(function(e) {
	    $(popUpWindow).hide();
	    //console.log(popUpWindow);
	    var rect = this.canvas.getBoundingClientRect();
		//console.log(rect.left, rect.top, rect.right, rect.bottom );
		var currentPoint = getRelCursorPosition(e, this.canvas);
		//console.log("WindowX:" + (currentPoint[0]));
		//console.log("WindowY:" + (currentPoint[1]));
		//console.log("AdjustX:" + (currentPoint[0] - rect.left));
		//console.log("AdjustY:" + (currentPoint[1] - rect.top));
    	$(popUpWindow).css('top', currentPoint[1] + moveDown).css('left', currentPoint[0] + moveLeft);
    	
      	var currentBaseHover = Math.ceil(currentPoint[0]/this.painter.cw) - this.painter.nameOffSet/this.painter.cw + this.baseStart -1;
        var currentSeqHover = Math.ceil(currentPoint[1]/this.painter.ch) + this.seqStart - 1;
        //console.log(currentBaseHover);
        //console.log(currentSeqHover);
        
        if(currentPoint[0] > this.painter.nameOffSet){
        	//console.log($("#info", popUpWindow)[0]);
        	$("#info", popUpWindow)[0].innerHTML = "name: " + 
        	this.seqs[currentSeqHover]["name"]
        	+ "<br>base: "  + this.seqs[currentSeqHover]["seq"][currentBaseHover] 
        	+ "<br>qual: " +  this.seqs[currentSeqHover]["qual"][currentBaseHover]
        	+ "<br>pos: " + currentBaseHover;
        }else{
        	$("#info", popUpWindow)[0].innerHTML = "name: " + 
        	this.seqs[currentSeqHover]["name"];
        }

		if(currentPoint[1] < (this.painter.nSeqs * this.painter.ch) && 
			currentPoint[0] < ((this.painter.nBases * this.painter.cw) + this.painter.nameOffSet)){
			$(popUpWindow).fadeIn(500);
		}else{
			$(popUpWindow).hide();
		}
    }.bind(this)).bind(this);
   };


    var cellWidth = 20;
    var cellHeight = 25;
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
    var createMinTree = function(data, appendTo, name, width, height){
	// create a interconnected graph for a minimum spanning tree
	// data needs to have a "nodes" array and a "links" array 
	// nodes need to have at least the following variables, color (color of node), 
	// name (name of the node), and size (the size of the node)
	// links need to have at least color (the color of the link), target (the node position to connect to), 
	// source (the node position from where the connection is forming), and value (the value that controls the link distance)
	var svg = d3.select(appendTo).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("id", name);
	
	d3.json(data, function(error, graph)
	 {
	 var force = d3.layout.force()
	    .charge(-120)
	    .linkDistance(function(d, i){ return d.value * 10;})
	    .size([width, height]);
	    
	  force
	      .nodes(graph.nodes)
	      .links(graph.links)
	      .start();
	
	  var link = svg.selectAll(".link")
	      .data(graph.links)
	      .enter().append("line")
	      .attr("class", "link")
	      .style("stroke-width", function(d) { return Math.sqrt(d.value);})
	      .style("stroke", function(d) { return d.color;});
	
	  var node = svg.selectAll(".node")
	      .data(graph.nodes)
	    .enter().append("circle")
	      .attr("class", "node")
	      .attr("r", function(d){ return Math.pow(d.size * 60, 1/2);})
	      .style("fill", function(d) { return d.color; })
	      .call(force.drag);
	
	  node.append("title")
	      .text(function(d) { return d.name; });
	
	  force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });
	
	    node.attr("cx", function(d) { return d.x; })
	        .attr("cy", function(d) { return d.y; });
	  });
	  
	});
	return force;
};
