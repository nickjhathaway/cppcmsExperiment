//
// SeekDeep - A library for analyzing amplicon sequence data
// Copyright (C) 2012-2016 Nicholas Hathaway <nicholas.hathaway@umassmed.edu>,
// Jeffrey Bailey <Jeffrey.Bailey@umassmed.edu>
//
// This file is part of SeekDeep.
//
// SeekDeep is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// SeekDeep is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with SeekDeep.  If not, see <http://www.gnu.org/licenses/>.
//
//

   
	function SeqPainterSvg(cellWidth, cellHeight, numOfSeqs, numOfBases, nameOffSet, baseColors){
		this.needToPaint = true;
		this.cw = cellWidth;
		this.ch = cellHeight;
		this.nSeqs = numOfSeqs;
		this.nBases = numOfBases;
		this.bColors = baseColors;
		this.nameOffSet = nameOffSet;
	}
	
	SeqPainterSvg.prototype.initialize = function(mainSvg, seqData){
		var self = this;
		this.paintSeqs(mainSvg, seqData, 0, 0);
	};
		
	//draw all necessary seqs
	SeqPainterSvg.prototype.paintSeqs = function(mainSvg, seqData, sStart, bStart){
    	if(this.needToPaint){
    		var self = this;
    		var seqGroups = mainSvg
    			.selectAll(".seqGroup")
    			.data(seqData["seqs"].slice(sStart, sStart + this.nSeqs));
    		//add any extrac seq groups that need to be added
    		var enteringSeqGroups = seqGroups
    			.enter()
    				.append("g")
    					.attr("class", "seqGroup")
    					.attr("transform", function(d,i){return "translate(0," + i * self.ch + ")"});
    		enteringSeqGroups.append("rect")
				.attr("class", "nameRects")
				.attr("width", this.nameOffSet)
				.attr("height", this.ch)
				.attr("fill", "#EEEEEE")
				.attr("stroke", "#000000");
			enteringSeqGroups.append("text")
				.attr("class", "nameText")
				.attr("x", 4)
				.attr("y", self.ch/1.5)
				.attr("fill", "#000000");
			//get rid of any groups that no longer have data
    		seqGroups
    			.exit()
    			.remove();
    		//set the names
    		seqGroups.selectAll(".nameText")
    			.text(function(d){return d3.select(this.parentNode).datum()["name"];});
    		//add bases rects that need to be added
    		var seqGroupsBaseRects = seqGroups.selectAll(".baseRects")
    			.data(function(d){ return d["seq"].slice(bStart, bStart + self.nBases);});
    		seqGroupsBaseRects
    			.enter()
    				.append("rect")
    				.attr("class", "baseRects")
    				.attr("x", function(d,i){ return self.nameOffSet + i * self.cw})
    				.attr("width", this.cw)
    				.attr("height", this.ch);
			//get rid of any base that no longer have data
    		seqGroupsBaseRects
    			.exit()
    			.remove();
    		//set the rects colors
    		seqGroupsBaseRects
    				.attr("fill", function(d){ return self.bColors[d]})
    				.attr("stroke",function(d){ return self.bColors[d]});
    		//add base texts that need to be added;
    		var seqGroupsBaseTexts = seqGroups.selectAll(".baseTexts")
    			.data(function(d){ return d["seq"].slice(bStart, bStart + self.nBases);});
    		seqGroupsBaseTexts
    			.enter()
    				.append("text")
    				.attr("class", "baseTexts")
    				.attr("x", function(d,i){ return self.nameOffSet + i * self.cw + self.cw/4;})
    				.attr("y", self.ch * .75)
    				.attr("fill", "#000000");
			//get rid of any text that no longer have data
    		seqGroupsBaseTexts
    			.exit()
    			.remove();
    		
    		//set the text for bases
    		seqGroupsBaseTexts
    				.text(function(d,i){ return d;});
	    	this.needToPaint = false;
    	}
	};
	
	//paint seq position
	SeqPainterSvg.prototype.placeBasePos = function(mainSvg, sStart, bStart){
		var baseStartPos = mainSvg.selectAll("#baseStartPos")
			.data([bStart]);
		
		baseStartPos.enter()
			.append("text")
				.attr("id","baseStartPos" )
				.attr("filter", "url(#solidBg)")
				.attr("fill", "#000000");
				
		
		baseStartPos.attr("x", this.nameOffSet)
			.attr("y", this.nSeqs * this.ch + 2 + this.ch/2.0)
			.text(function(d){return d;});
		
		var baseStopPos = mainSvg.selectAll("#baseStopPos")
			.data([bStart + this.nBases - 1]);
		
		baseStopPos.enter()
			.append("text")
				.attr("id","baseStopPos" )
				.attr("filter", "url(#solidBg)")
				.attr("fill", "#000000");
				
		
		baseStopPos.attr("x", this.nameOffSet + this.nBases * this.cw - this.cw)
			.attr("y", this.nSeqs * this.ch + 2 + this.ch/2.0)
			.text(function(d){return d;});
		
		var seqStartPos = mainSvg.selectAll("#seqStartPos")
			.data([sStart]);
		
		seqStartPos.enter()
			.append("text")
				.attr("id","seqStartPos" )
				.attr("filter", "url(#solidBg)")
				.attr("fill", "#000000");
		
		seqStartPos
			.attr("x", this.nameOffSet + this.nBases * this.cw + this.cw/5.0)
			.attr("y", this.ch/1.5)
			.text(function(d){return d;});
		
		var seqStopPos = mainSvg.selectAll("#seqStopPos")
			.data([sStart + this.nSeqs]);
		
		seqStopPos.enter()
			.append("text")
				.attr("id","seqStopPos" )
				.attr("filter", "url(#solidBg)")
				.attr("fill", "#000000")
				;
		
		seqStopPos.attr("x", this.nameOffSet + this.nBases * this.cw + this.cw/5.0 )
			.attr("y", this.nSeqs * this.ch - this.ch/4.0)
			.text(function(d){return d;});
   };
   
   SeqPainterSvg.prototype.paintSelectedSeq = function(mainSvg, seq, currentBase){
  		var logInfo ="";
   		if(currentBase < 0){
   	   		logInfo = "name: "  
   	   			+ seq["name"];
   		}else{
   	   		logInfo = "name: "  
		        	+ seq["name"]
		        	+ " base: "  + seq["seq"][currentBase] 
		        	+ " qual: " +  seq["qual"][currentBase]
		        	+ " pos: " + currentBase;
   		}
		var selectedSeqInfo = mainSvg.selectAll("#selectedSeqInfo")
			.data([logInfo]);
		
		selectedSeqInfo.enter()
			.append("text")
				.attr("id","selectedSeqInfo" )
				.attr("filter", "url(#solidBg)")
				.attr("fill", "#000000");		
		selectedSeqInfo.attr("x", this.nameOffSet + this.cw + 20 )
			.attr("y", (this.nSeqs)*this.ch + 2  + this.ch/2)
			.text(function(d){return d;});

   };

	function njhSeqViewSvg(viewName, seqData, cellWidth, cellHeight, baseColors,addQualChart, minTreeLink, protein){
		//need to add style and html, currently just there
		//retrieve html elements 
		this.topDivName = viewName;
		this.topDiv = document.getElementById(viewName);
		$(this.topDiv).addClass("SeqView");
		this.uid = seqData["uid"];
		this.selected = new Set(seqData["selected"]);
		this.menuDiv = d3.select(viewName).append("div")
				.attr("class", "njhSeqViewMenu");
		this.setUpDefaultMenu(protein);
		if(minTreeLink != undefined && !protein){
			d3.select(viewName).append("div")
				.attr("id", "minTreeDiv")
				.style("border", "2px solid black")
				.style("padding", "2px")
				.style("margin", "5px")
				.style("width", "100px")
				.style("float", "left")
				.append("a")
					.attr("href", minTreeLink)
					.text("Show Minimum Spanning Tree");
		}
		d3.select(viewName).append("div")
			.attr("class", "downFastaDiv")
			.style("margin", "5px")
			.style("float", "left");
		if(!protein){
			d3.select(viewName).append("div")
				.attr("class", "downFastqDiv")
				.style("margin", "5px")
				.style("float", "left");
		}

		d3.select(viewName).append("div")
			.attr("class", "deselectDiv")
			.style("margin", "5px")
			.style("float", "left");
		this.masterDivD3 = d3.select(viewName).append("div").attr("class", "SeqViewCanvasDiv");
		this.masterDivD3
			.append("div")
			.attr("class", "rightSliderDiv")
			.append("input")
				.attr("class", "rightSlider")
				.attr("data-slider-id", "rightSliderCon");;
		this.seqSvgMaster = this.masterDivD3
			.append("svg")
				.attr("class", "NjhSeqViewerMainSvg")
		var filterSvg = this.seqSvgMaster.append("defs")
			.append("filter")
				.attr("x", "0")
				.attr("y", "0")
				.attr("width", "1")
				.attr("height", "1")
				.attr("id", "solidBg");
		filterSvg.append("feFlood")
			.attr("flood-color", "#EEEEEE")
		filterSvg.append("feComposite")
			.attr("in", "SourceGraphic")

		this.masterDivD3
			.append("div")
			.attr("class", "bottomSliderDiv")
			.append("input")
				.attr("class", "bottomSlider")
				.attr("data-slider-id", "bottomSliderCon");
		this.masterDivD3.append("div").attr("class", "pop-up").append("p").attr("id", "info");
		this.masterDivD3.append("div").attr("class", "select");
		d3.select(viewName).append("div").attr("class", "qualChart");
		d3.select(viewName).append("div")
			.attr("id", "minTreeChartTop");
		var self = this;
		var linkButton = d3.select(this.topDivName + " .downFastaDiv")
			.append("button")
				.text("Download Fasta")
				.attr("class", "fastaSaveButton btn btn-success");
		var fastqLinkButton;
		if(!protein){
			fastqLinkButton = d3.select(this.topDivName + " .downFastqDiv")
				.append("button")
					.text("Download Fastq")
					.attr("class", "fastqSaveButton btn btn-primary");
		}

		var deselectButton = d3.select(this.topDivName + " .deselectDiv")
			.append("button")
				.text("Un-select All")
				.attr("class", "deselectAllBut btn btn-info");
		deselectButton.on("click", function(){
			self.selected.clear();
			self.updateSelectors();
		});
		linkButton.append("a")
				.attr("class", "fastaDownLink");
		
		linkButton.on("click", function(){
		    var mainTable = [];
		    //
		    if (self.selected.size > 0){
		    	var sels = setToArray(self.selected);
			    for (i in sels) {
			    	//console.log(sels[i]);
					mainTable.push([">" + self.seqData["seqs"][sels[i]]["name"]]);
					mainTable.push([self.seqData["seqs"][sels[i]]["seq"]]);
				}
		    }else{
			    for (i = 0; i <self.seqData["seqs"].length ; i++) { 
					mainTable.push([">" + self.seqData["seqs"][i]["name"]]);
					mainTable.push([self.seqData["seqs"][i]["seq"]]);
				}
		    }

		  	var fastaData = 'data:text/plain;base64,'+ btoa(d3.tsv.format(mainTable));
		  	linkButton.select(".fastaDownLink").attr("download", self.seqData["uid"] + ".fasta");
		  	linkButton.select(".fastaDownLink").attr("href", fastaData).node().click();
		});
		if(!protein){
			fastqLinkButton.append("a")
				.attr("class", "fastqDownLink");
			fastqLinkButton.on("click", function(){
			    var mainTable = [];
			    //
			    if (self.selected.size > 0){
			    	var sels = setToArray(self.selected);
				    for (i in sels) {
				    	//console.log(sels[i]);
						mainTable.push(["@" + self.seqData["seqs"][sels[i]]["name"]]);
						mainTable.push([self.seqData["seqs"][sels[i]]["seq"]]);
						mainTable.push(["+"]);
						mainTable.push([self.seqData["seqs"][sels[i]]["qual"].map(function(q){return String.fromCharCode(33 + q);}).join("")]);
					}
			    }else{
				    for (i = 0; i <self.seqData["seqs"].length ; i++) { 
						mainTable.push(["@" + self.seqData["seqs"][i]["name"]]);
						mainTable.push([self.seqData["seqs"][i]["seq"]]);
						mainTable.push(["+"]);
						mainTable.push([self.seqData["seqs"][i]["qual"].map(function(q){return String.fromCharCode(33 + q);}).join("")]);
					}
			    }
			  	var fastqData = 'data:text/plain;base64,'+ btoa(d3.tsv.format(mainTable));
			  	fastqLinkButton.select(".fastqDownLink").attr("download", self.seqData["uid"] + ".fastq");
			  	fastqLinkButton.select(".fastqDownLink").attr("href", fastqData).node().click();
			});
		}

		//this.masterDiv = document.getElementById(viewName);
		this.masterDiv = this.masterDivD3.node();

		
		this.rSlider = $(".rightSlider", this.masterDiv)[0];
		this.bSlider = $(".bottomSlider", this.masterDiv)[0];
		this.rSliderDiv = $(".rightSliderDiv", this.masterDiv)[0];
		this.bSliderDiv = $(".bottomSliderDiv", this.masterDiv)[0];
		this.popUp = $(".pop-up", this.masterDiv)[0];
		this.sel = $(".select", this.masterDiv)[0];
		
		this.seqData = seqData;
		this.seqStart = 0;
		this.baseStart = 0;
		this.currentSeq = 0;
		this.currentBase = 0;
		// set up of sizes
		$(this.masterDiv).width((window.innerWidth - 10) * 0.98);
		$(this.masterDiv).height((window.innerHeight - 60) * 0.98);
		this.seqSvgMaster.attr("width", $(this.masterDiv).width() * 0.98)
				.attr("height", $(this.masterDiv).height() * 0.95)
		this.seqSvgMasterG = this.seqSvgMaster
					.append("g")
					    .style("font-family", "Arial")
    					.style("font-size", "15px")
    					.style("font-weight", "bold");
        
		var nameOffSet = 10 * cellWidth;
		var numOfBases = Math.min(Math.floor((parseInt(this.seqSvgMaster.style("width")) - cellWidth - nameOffSet)/cellWidth),this.seqData["maxLen"] );
	 	var numOfSeqs = Math.min(Math.floor((parseInt(this.seqSvgMaster.style("height")) - cellHeight)/cellHeight), this.seqData["seqs"].length);
		this.painterSvg = new SeqPainterSvg(cellWidth, cellHeight, numOfSeqs, numOfBases, nameOffSet, baseColors);
		
		if(addQualChart){
			this.addedQualChart = true;
			this.chart = c3.generate({
				bindto: this.topDivName + " .qualChart",
			    data: {
			        json: {
			            qual: this.seqData["seqs"][this.currentSeq]["qual"]
			        }
			    }, 
				grid: {
			        y: {
			            lines: [{value: 20}]
			        }
			    },
			    axis: {
			    	y : {
			    		max: 50,
			            min: 0
			    	}
			    }
			});
		}else{
			this.addedQualChart = false;
		}
		
	};
	
	
	
	njhSeqViewSvg.prototype.setUpDefaultMenu = function(protein){
		var locSplit = window.location.toString().split(/[\/]+/);
		var rName = locSplit[2];
		var menuItems = {};
		var sortOptions = [];
		var self = this;
		sortOptions.push(new njhMenuItem("sortSeq", "Sequence",function(){
			var mainData;
			var postData = {"uid" : self.uid};
			if (self.selected.size > 0){
				postData["selected"] = setToArray(self.selected);
			}
			ajaxPost('/' + rName + '/sort/seq',postData, function(md){ mainData = md; });
		    //console.log(self.uid);
		    self.updateData(mainData);
		}));
		sortOptions.push(new njhMenuItem("sortSeqCondensed", "Sequence Condensed",function(){
			var mainData;
			var postData = {"uid" : self.uid};
			if (self.selected.size > 0){
				postData["selected"] = setToArray(self.selected);
			}
			ajaxPost('/' + rName + '/sort/seqCondensed',postData, function(md){ mainData = md; });
	    	self.updateData(mainData);
		}));
		sortOptions.push(new njhMenuItem("sortTotalCount", "Total Read Count",function(){
			var mainData;
			var postData = {"uid" : self.uid};
			if (self.selected.size > 0){
				postData["selected"] = setToArray(self.selected);
			}
			ajaxPost('/' + rName + '/sort/totalCount',postData, function(md){ mainData = md; });
		    self.updateData(mainData);
		}));
		sortOptions.push(new njhMenuItem("sortSize", "Length",function(){
			var mainData;
			var postData = {"uid" : self.uid};
			if (self.selected.size > 0){
				postData["selected"] = setToArray(self.selected);
			}
			ajaxPost('/' + rName + '/sort/size',postData, function(md){ mainData = md; });
		    self.updateData(mainData);
		}));
		sortOptions.push(new njhMenuItem("sortName", "Name",function(){
			var mainData;
			var postData = {"uid" : self.uid};
			if (self.selected.size > 0){
				postData["selected"] = setToArray(self.selected);
			}
			ajaxPost( '/' + rName + '/sort/name',postData, function(md){ mainData = md; });
		    self.updateData(mainData);
		}));
		sortOptions.push(new njhMenuItem("sortName", "Reverse",function(){
			var mainData;
			var postData = {"uid" : self.uid};
			if (self.selected.size > 0){
				postData["selected"] = setToArray(self.selected);
			}
			ajaxPost( '/' + rName + '/sort/reverse',postData, function(md){ mainData = md; });
		    self.updateData(mainData);
		}));
		menuItems["Sort"] = sortOptions;
		var alnOptions = [];
		alnOptions.push(new njhMenuItem("muscle", "muscle",function(){
			var mainData;
			var postData = {"uid" : self.uid};
			if (self.selected.size > 0){
				postData["selected"] = setToArray(self.selected);
			}
			ajaxPost( '/' + rName + '/muscle',postData, function(md){ mainData = md; });
		    self.updateData(mainData);
		}));
		alnOptions.push(new njhMenuItem("removeGaps", "remove gaps",function(){
			var mainData;
			var postData = {"uid" : self.uid};
			if (self.selected.size > 0){
				postData["selected"] = setToArray(self.selected);
			}
			ajaxPost( '/' + rName + '/removeGaps',postData, function(md){ mainData = md; });
		    self.updateData(mainData);
		}));
		menuItems["Aln"] = alnOptions;
		

		if(!protein){
			var editOptions = [];
			editOptions.push(new njhMenuItem("complement", "Reverse Complement",function(){
				var mainData;
				var postData = {"uid" : self.uid};
				if (self.selected.size > 0){
					postData["selected"] = setToArray(self.selected);
				}
				var ar = setToArray(self.selected);
				ajaxPost( '/' + rName + '/complement',postData, function(md){ mainData = md; });
			    self.updateData(mainData);
			}));
			menuItems["Edit"] = editOptions;
		}

		if(!protein){
			var translateOptions = [];
			translateOptions.push(new njhMenuItem("translate", "Translate",function(){
				var mainData;
				//console.log($("#startSiteInput", self.topDivName).val());
				var postData = {"uid" : self.uid, "start" : $("#startSiteInput", self.topDivName).val()};
				if (self.selected.size > 0){
					postData["selected"] = setToArray(self.selected);
				}
				var ar = setToArray(self.selected);
				ajaxPost( '/' + rName + '/translate',postData, function(md){ mainData = md; });
			    //console.log(mainData);
			    //console.log(self.topDivName.substring(1) + "_protein");
			    if($("#" + self.topDivName.substring(1) + "_protein").length){
			    	self.proteinViewer.updateData(mainData);
			    }else{
			    	var proteinColors = {};
					ajax('/' + rName + '/proteinColors', function(bc){ proteinColors = bc; });
			    	$( "<div id = \"" + self.topDivName.substring(1) + "_protein" +   "\"></div>" ).insertAfter( self.topDivName );
			    	self.proteinViewer = new njhSeqViewSvg("#" + self.topDivName.substring(1) + "_protein", mainData, self.painterSvg.cw, self.painterSvg.ch, proteinColors,false, "", true);
			    	self.proteinViewer.setUp();
			    	self.proteinViewer.paint();
			    }
			    $("#" + self.topDivName.substring(1) + "_protein").scrollView();
			    
			}));
			menuItems["Translate"] = translateOptions;
		}
		var windowOptions = [];
		if(!protein){
			windowOptions.push(new njhMenuItem("ShowQual", "Hide Qual Graph",function(){
				if( self.addedQualChart){
					self.addedQualChart = false;
					d3.select(self.topDivName +  " .njhSeqViewMenu #ShowQual").text("Show Qual Graph");
					d3.select(self.topDivName + " .qualChart").selectAll("*").remove();
					self.chart = null;
				}else{
					self.addedQualChart = true;
					d3.select(self.topDivName +  " .njhSeqViewMenu #ShowQual").text("Hide Qual Graph");
					self.chart = c3.generate({
						bindto: self.topDivName + " .qualChart",
					    data: {
					        json: {
					            qual: self.seqData["seqs"][self.currentSeq]["qual"]
					        }
					    }, 
						grid: {
					        y: {
					            lines: [{value: 20}]
					        }
					    },
					    axis: {
					    	y : {
					    		max: 50,
					            min: 0
					    	}
					    }
					});
					self.chart.xgrids([{value: self.currentBase, text:self.seqData["seqs"][self.currentSeq]["qual"][self.currentBase]}]);
				}
			}));
			windowOptions.push(new njhMenuItem("GenTree", "Gen Difference Graph",function(){
				if(!($(self.topDivName + " #minTreeChartTop #saveButton").length)){
					d3.select(self.topDivName + " #minTreeChartTop").append("button")
					.style("float", "top")
					.attr("class", "btn btn-success")
					.attr("id", "saveButton")
					.style("margin", "2px")
					.text("Save As Svg");
					addSvgSaveButton(self.topDivName + " #minTreeChartTop #saveButton", self.topDivName + " #minTreeChartTop #minTreeChart #chart", self.seqData["uid"])
				}
				if(!($(self.topDivName + " #minTreeChartTop #minTreeChart").length)){
					d3.select(self.topDivName + " #minTreeChartTop").append("svg").attr("id", "minTreeChart")
					.attr("width", "0px")
					.attr("height", "0px")
					.style("margin-left", "10px")
				}else{
					d3.select(self.topDivName + " #minTreeChart").selectAll("*").remove();
				}
				var jsonData;
				var postData = {"uid" : self.uid};
				if (self.selected.size > 0){
					postData["selected"] = setToArray(self.selected);
				}
				postData["numDiff"] = $("#numDiffInput", self.topDivName).val();
				var ar = setToArray(self.selected);
				ajaxPost( '/' + rName + '/minTreeDataDetailed',postData, function(md){ jsonData = md; });
				drawPsuedoMinTreeDetailed(jsonData, self.topDivName + " #minTreeChart", "minTreeChart",
						$("#treeWidthInput", self.topDivName).val(),$("#treeHeightInput", self.topDivName).val());
				$('#minTreeChart').scrollView();
			}));
			windowOptions.push(new njhMenuItem("HideTree", "Hide Difference Graph",function(){
				d3.select(self.topDivName + " #minTreeChartTop").selectAll("*").remove();
			}));

			menuItems["Graphs"] = windowOptions;
		}

		
		createSeqMenu(this.topDivName + " .njhSeqViewMenu", menuItems);
		
		if(!protein){
			var startSiteInput = d3.select(self.topDivName +  " .njhSeqViewMenu #TranslateDrops")
			.append("li")
				.append("div")
					.attr("style", "padding: 3px 20px;")
				.append("form")
					.attr("class", "form-inline")
					.attr("id", "startSiteForm");
			startSiteInput
				.append("label")
					.attr("id", "startSiteLabel")
					.attr("for","startSiteInput")
					.attr("class", "control-label")
					.text("Start")
					.style("margin-right", "5px");
			var divInputGroup = startSiteInput
				.append("div")
				.attr("class", "input-group");
			divInputGroup.append("input")
				.attr("type", "number")
				.attr("class", "form-control")
				.attr("id", "startSiteInput")
				.attr("step", "1")
				.attr("min", "0")
				.attr("max", "2")
				.attr("value", "0");
			$('#startSiteForm').submit(function(e){
		        e.preventDefault();
		        //console.log($("#startSiteInput").val());
		    });
			var treeWidthInput = d3.select(self.topDivName +  " .njhSeqViewMenu #GraphsDrops")
			.append("li")
				.append("div")
					.attr("style", "padding: 3px 20px;")
				.append("form")
					.attr("class", "form-inline")
					.attr("id", "treeWidthForm");
			treeWidthInput
				.append("label")
					.attr("id", "treeWidthLabel")
					.attr("for","treeWidthInput")
					.attr("class", "control-label")
					.text("Graph Window Width")
					.style("margin-right", "5px");;
			var divtreeWidthInputGroup = treeWidthInput
				.append("div")
				.attr("class", "input-group");
			divtreeWidthInputGroup.append("input")
				.attr("type", "number")
				.attr("class", "form-control")
				.attr("id", "treeWidthInput")
				.attr("step", "100")
				.attr("min", "0")
				.attr("value", "1000");
			$('#treeWidthForm').submit(function(e){
		        e.preventDefault();
		        //console.log($("#startSiteInput").val());
		    });
			var treeHeightInput = d3.select(self.topDivName +  " .njhSeqViewMenu #GraphsDrops")
			.append("li")
				.append("div")
					.attr("style", "padding: 3px 20px;")
				.append("form")
					.attr("class", "form-inline")
					.attr("id", "treeHeightForm");
			treeHeightInput
				.append("label")
					.attr("id", "treeHeightLabel")
					.attr("for","treeHeightInput")
					.attr("class", "control-label")
					.text("Graph Window Height")
					.style("margin-right", "5px");;
			var divTreeHeightInputGroup = treeHeightInput
				.append("div")
				.attr("class", "input-group");
			divTreeHeightInputGroup.append("input")
				.attr("type", "number")
				.attr("class", "form-control")
				.attr("id", "treeHeightInput")
				.attr("step", "100")
				.attr("min", "0")
				.attr("value", "1000");
			$('#treeHeightForm').submit(function(e){
		        e.preventDefault();
		        //console.log($("#startSiteInput").val());
		    });
			
			var numDiffInput = d3.select(self.topDivName +  " .njhSeqViewMenu #GraphsDrops")
			.append("li")
				.append("div")
					.attr("style", "padding: 3px 20px;")
				.append("form")
					.attr("class", "form-inline")
					.attr("id", "numDiffForm");
			numDiffInput
				.append("label")
					.attr("id", "numDiffLabel")
					.attr("for","numDiffInput")
					.attr("class", "control-label")
					.text("Num Diff\n0=min to connect all")
					.style("margin-right", "5px");;
			var divNumDiffInputGroup = numDiffInput
				.append("div")
				.attr("class", "input-group");
			divNumDiffInputGroup.append("input")
				.attr("type", "number")
				.attr("class", "form-control")
				.attr("id", "numDiffInput")
				.attr("step", "1")
				.attr("min", "0")
				.attr("value", "0");
			$('#numDiffForm').submit(function(e){
		        e.preventDefault();
		        //console.log($("#startSiteInput").val());
		    });
		}	
	};

	njhSeqViewSvg.prototype.updateData = function(inputSeqData){
		this.seqData = inputSeqData;
		this.uid = inputSeqData["uid"];
		this.painterSvg.nSeqs = Math.min(Math.floor((parseInt(this.seqSvgMaster.style("height")) - this.painterSvg.ch)/this.painterSvg.ch), this.seqData["seqs"].length);
		this.painterSvg.needToPaint = true;
		this.needToPaint = true;
		this.updateCanvas();
		this.setUpSliders();
		this.paint();
	};
	
	njhSeqViewSvg.prototype.resetSelection = function(){
		this.seqStart = 0;
		this.baseStart = 0;
		this.currentSeq = 0;
		this.currentBase = 0;
	}
	

	
	njhSeqViewSvg.prototype.setUp = function(){
		this.setUpCanvas();
		this.setUpSliders();
		this.setUpListeners();
		this.setSelector();
	};
	
	njhSeqViewSvg.prototype.updateSeqDims = function(){
		this.painterSvg.nBases = Math.min(Math.floor((parseInt(this.seqSvgMaster.style("width")) - this.painterSvg.cw - this.painterSvg.nameOffSet)/this.painterSvg.cw),this.seqData["maxLen"] );
		this.painterSvg.nSeqs = Math.min(Math.floor((parseInt(this.seqSvgMaster.style("height")) - this.painterSvg.ch)/this.painterSvg.ch), this.seqData["seqs"].length);
	}
	
	njhSeqViewSvg.prototype.setUpCanvas = function(){
		$(this.masterDiv).width((window.innerWidth - 10) * 0.98);
		var maxPossHeight = this.painterSvg.ch * (this.seqData["seqs"].length + 4);
		$(this.masterDiv).height(Math.min((window.innerHeight - 60) * 0.80, maxPossHeight));
		this.seqSvgMaster.attr("height", Math.min((window.innerHeight - 60) * 0.80, maxPossHeight) * 0.95)
		this.updateSeqDims();
		this.updateSelectors();
		this.painterSvg.initialize(this.seqSvgMasterG, this.seqData);
	};
	
	njhSeqViewSvg.prototype.updateCanvas = function(){
		var self = this
		var changingHeight = (window.innerHeight - 60) * 0.80;
		var changingWidth = (window.innerWidth - 10) * 0.98;
		$(this.masterDiv).width((window.innerWidth - 10) * 0.98);
		var maxPossHeight = this.painterSvg.ch * (this.seqData["seqs"].length + 4);
		$(this.masterDiv).height(Math.min((window.innerHeight - 60) * 0.80, maxPossHeight));
		this.seqSvgMaster.attr("width", $(self.masterDiv).width() * 0.96);
		this.seqSvgMaster.attr("height", $(self.masterDiv).height() * 0.95);
		if(changingHeight > parseInt(this.seqSvgMaster.style("height"))){
			this.painterSvg.needToPaint = true;
		}
		if(changingWidth > parseInt(this.seqSvgMaster.style("width"))){
			this.painterSvg.needToPaint = true;
		}
		this.updateSeqDims();
		this.updateSelectors();
	};

	njhSeqViewSvg.prototype.paint = function(){
		this.painterSvg.paintSeqs(this.seqSvgMasterG, this.seqData, this.seqStart, this.baseStart);
		this.painterSvg.placeBasePos(this.seqSvgMasterG, this.seqStart, this.baseStart);
		this.paintSelectedSeq();
		this.setSelector();
		this.updateSelectors();
	};
	
	njhSeqViewSvg.prototype.paintSelectedSeq = function(){
		this.painterSvg.paintSelectedSeq(this.seqSvgMasterG, this.seqData["seqs"][this.currentSeq], this.currentBase );
	};
	
	njhSeqViewSvg.prototype.setSelector = function(){
		if(this.currentBase >= this.baseStart && this.currentSeq >=this.seqStart){
			$(this.sel).css('top', (this.currentSeq - this.seqStart) *this.painterSvg.ch -1);
			$(this.sel).css('left', (this.currentBase - this.baseStart) *this.painterSvg.cw + this.painterSvg.nameOffSet -1);
			$(this.sel).show();
		}else{
			$(this.sel).hide();
		}
	};
	
	njhSeqViewSvg.prototype.updateSelectors = function(){
		var self = this;
		var selectors = d3.select(this.topDivName + " .SeqViewCanvasDiv").selectAll(".seqHighlight")
			.data(setToArray(this.selected));
		var lowerBound = this.seqStart;
		var upperBound = this.seqStart + this.painterSvg.nSeqs;
		selectors.enter().append("div")
			.attr("class", "seqHighlight")
			.style("width", function(d){ 
				return self.painterSvg.nameOffSet.toString() + "px";})
			.style("height",function(d){ return self.painterSvg.ch.toString() + "px";});
		selectors.exit().remove();
		
		selectors.style("visibility",function(d){ 
				if(d >= lowerBound && d < upperBound){
					return "visible";
				}else{
					return "hidden";
				}})
			.style("top", function(d){ 
				if(d >= lowerBound && d < upperBound){
					return ((d - self.seqStart) *self.painterSvg.ch).toString() + "px"; 
				}else{
					return 0;
				}})
			.style("left",function(d){ 
				//console.log(d);
				if(d >= lowerBound && d < upperBound){
					return 0;
				}else{
					return 0;
				}});
	};
	
    njhSeqViewSvg.prototype.mouseWheelUp = function(steps){
        if(this.seqStart > 0){
        	--this.seqStart;
        	$(this.rSlider).bootstrapSlider('setValue', this.seqStart);
        	this.painterSvg.needToPaint = true;
        	this.paint();
        }
    };

    njhSeqViewSvg.prototype.mouseWheelDown = function(steps){
        if(this.seqStart < Math.max(this.seqData["numReads"]- this.painterSvg.nSeqs, 0)){
        	++this.seqStart;
        	$(this.rSlider).bootstrapSlider('setValue', this.seqStart);
        	this.painterSvg.needToPaint = true;
        	this.paint();
        }
    };
    
	njhSeqViewSvg.prototype.setUpSliders = function(){
		var self = this;
		$(this.bSliderDiv).css("left", this.painterSvg.nameOffSet);
		$(this.bSliderDiv).css("width", this.painterSvg.nBases * this.painterSvg.cw);
		$(this.bSlider).css("width", this.painterSvg.nBases * this.painterSvg.cw);
	    $(this.bSlider).bootstrapSlider({
	     // range: "min",
	      min: 0,
	      max: Math.max(self.seqData["maxLen"] - self.painterSvg.nBases, 0),
	      value: 0
	    });
	    $( this.bSlider ).on("slide", function(slideEvent){
	    	  self.baseStart = slideEvent.value;
	    	  self.painterSvg.needToPaint = true;
	    	  self.paint();
	    });  
	    $(this.rSliderDiv).css("height", this.painterSvg.nSeqs * this.painterSvg.ch);
	    $(this.rSlider).css("height", this.painterSvg.nSeqs * this.painterSvg.ch);
	    
	    $( this.rSlider ).bootstrapSlider({
	      //range: "max",
	      min: 0,
	      tooltip_position:'left',
	      max: Math.max(self.seqData["numReads"]- self.painterSvg.nSeqs, 0),
	      value: 0,
	      orientation: "vertical"
	    });
	    $( this.rSlider ).on("slide", function(slideEvent){
    	  self.painterSvg.needToPaint = true;
    	  //self.seqStart = self.seqData["numReads"] - self.painterSvg.nSeqs - slideEvent.value;
    	  self.seqStart = slideEvent.value;
    	  self.paint();
	    });
   };
   
   njhSeqViewSvg.prototype.updateOnResize = function(){
	   this.updateCanvas();
	   this.setUpSliders();
	   this.paint();
	   if(this.proteinViewer){
		   this.proteinViewer.updateOnResize();
	   }
   };
   
   njhSeqViewSvg.prototype.clicked = function(e){
        var pt = getRelCursorPosition(e, this.seqSvgMaster.node());
        if(pt[1] <= this.painterSvg.nSeqs * this.painterSvg.ch && 
        		pt[0] <= this.painterSvg.nBases * this.painterSvg.cw + this.painterSvg.nameOffSet){
        	this.currentSeq = Math.ceil(pt[1]/this.painterSvg.ch) + this.seqStart - 1;
        	if(pt[0] <= this.painterSvg.nameOffSet){
                //console.log(pt);
                //console.log(this.currentSeq);
                //console.log(this.selected);
        		if(this.selected.has(this.currentSeq)){
        			this.selected.delete(this.currentSeq);
        		}else{
        			this.selected.add(this.currentSeq);
        		}
        		this.updateSelectors();
        		//console.log(this.selected);
        	}
            this.currentBase = Math.ceil(pt[0]/this.painterSvg.cw) - this.painterSvg.nameOffSet/this.painterSvg.cw + this.baseStart -1;
            this.paintSelectedSeq();


            this.setSelector();
            var currentQual = this.seqData["seqs"][this.currentSeq]["qual"];
            if(this.chart){
        		this.chart.load({
        	        json: {
        	            qual: this.seqData["seqs"][this.currentSeq]["qual"]
        	        }
        	    });
        	    //this.chart.xgrids.remove();
        	    this.chart.xgrids([{value: this.currentBase, text:this.seqData["seqs"][this.currentSeq]["qual"][this.currentBase]}]);
            }

        }

    };
   njhSeqViewSvg.prototype.setUpListeners = function(){
	var self = this;
   	// add scrolling listener
   	addMouseScrollListener(this.seqSvgMaster.node(), this.mouseWheelUp.bind(this), this.mouseWheelDown.bind(this));
   	this.seqSvgMaster.node().addEventListener("mousedown", this.clicked.bind(this), false);
	//add hover box listening 
	var moveLeft = 20;
    var moveDown = 10;
    //object.hover(function(e) {
    $(this.seqSvgMaster.node()).hover(function(e) {
      //fadeInBox.fadeIn(500);
      $(self.popUp).fadeIn(500);
      //.css('top', e.pageY + moveDown)
      //.css('left', e.pageX + moveLeft)
      //.appendTo('body');
    }, function() {
      //fadeInBox.hide();
      $(self.popUp).hide();
    });

    $(this.seqSvgMaster.node()).mouseleave(function(e) {
    	$(self.popUp).hide();
    });
    $(this.seqSvgMaster.node()).mousemove(function(e) {
    	var currentPoint = getRelCursorPosition(e, self.seqSvgMaster.node());
        if(currentPoint[1] <= self.painterSvg.nSeqs * self.painterSvg.ch &&
        		currentPoint[0] <= self.painterSvg.nBases * self.painterSvg.cw + self.painterSvg.nameOffSet){
        	$(self.popUp).css('top', currentPoint[1] + moveDown).css('left', currentPoint[0] + moveLeft);
          	var currentBaseHover = Math.ceil(currentPoint[0]/self.painterSvg.cw) - self.painterSvg.nameOffSet/self.painterSvg.cw + self.baseStart -1;
            var currentSeqHover = Math.ceil(currentPoint[1]/self.painterSvg.ch) + self.seqStart - 1;
            var base = self.seqData["seqs"][currentSeqHover]["seq"][currentBaseHover];
            var qual = self.seqData["seqs"][currentSeqHover]["qual"][currentBaseHover];
			if(currentPoint[0] > self.painterSvg.nameOffSet){
	        	//console.log($("#info", self.popUp)[0]);
    	        $("#info", self.popUp)[0].innerHTML = "name: " + 
    	        	self.seqData["seqs"][currentSeqHover]["name"]
    	        	+ "<br>base: "  + base
    	        	+ "<br>qual: " +  qual 
    	        	+ "<br>pos: " + currentBaseHover;
	        }else{
	        	$("#info", self.popUp)[0].innerHTML = "name: " + 
	        	self.seqData["seqs"][currentSeqHover]["name"];
	        }
			$(self.popUp).show();
        }else{
        	$(self.popUp).hide();
        }
    });
   };

   
