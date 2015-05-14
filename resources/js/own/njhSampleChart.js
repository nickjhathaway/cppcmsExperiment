
function njhSampleChart(masterDivId, masterData, downLoadStubName){
	//Create the margins and set the width and height for the sample chart
	this.masterDivId = masterDivId;
	this.masterData = masterData;
	this.downLoadStubName = downLoadStubName;
	
	this.margin = {top: 20, right: 30, bottom: 110, left: 40},
	this.width = $(window).width() -100 - this.margin.left - this.margin.right,
	this.height = 600 - this.margin.top - this.margin.bottom;
	    
	//create tootip for sample chart
	this.tooltip = d3.select("body")
				.append("div")
				.style("position", "absolute")
				.style("visibility", "hidden")
				.style("background-color", "#88aaaa")
				.attr("id", this.masterDivId.substr(1) + "_popHover");
	this.tooltipId = "#" + this.masterDivId.substr(1)+ "_popHover";
	//create the table for the tooltip
	this.hoverTab = createTable(this.tooltipId);
	this.hoverTab.style("border", "1px solid black");
	this.hoverTab.style("box-shadow", "3px 3px 1.5px rgba(0, 0, 0, 0.5)");

	this.saveButton = d3.select(this.masterDivId)
						.append("button")
							.attr("class", "njhSampleChartSave")
							.style("margin", "2px")
							.text("Save as Svg");
	this.svgDiv = d3.select(this.masterDivId)
						.append("div")
							.attr("class", "njhSampleChartSvgDiv");
							
	//Select the chart and update with width and height
	this.masterSvg = this.svgDiv.append("svg")
						.attr("width", this.width + this.margin.left + this.margin.right)
			  			.attr("height", this.height + this.margin.top + this.margin.bottom);
	this.chart = this.masterSvg
			  			.append("g")
			    			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
	//create the x and y axes 
	this.x = d3.scale.ordinal()
	    .rangeRoundBands([0, this.width - 100], .1);
	
	this.y = d3.scale.linear()
	    .range([this.height, 0]);
			    
	this.xAxis = d3.svg.axis()
			    .scale(this.x)
			    .orient("bottom");
			
	this.yAxis = d3.svg.axis()
			    .scale(this.y)
			    .orient("left");
	//set up the colors and create the info needed for hover tooltip
	this.color = d3.scale.ordinal()
	    .domain(this.masterData["tab"].map(function(d) { return d.h_popUID; }))
	    .range(this.masterData["popColors"]);
	//initiate the counts to zero and no samples have been added
	var sampleSum = {};
	var samplePopNames = {};
	for(pos in this.masterData["tab"]){
		sampleSum[this.masterData["tab"][pos].s_Sample] = 0;
		samplePopNames[this.masterData["tab"][pos].s_Sample] = [];
	}
	for(pos in this.masterData["tab"]){
		var actualPos = this.masterData["tab"].length - 1 - pos;
		samplePopNames[this.masterData["tab"][actualPos].s_Sample].push({
			s_Sample: this.masterData["tab"][actualPos].s_Sample,
			h_popUID: this.masterData["tab"][actualPos].h_popUID,
			c_clusterID: this.masterData["tab"][actualPos].c_clusterID,
			c_AveragedFrac: this.masterData["tab"][actualPos].c_AveragedFrac,
			color: this.color(this.masterData["tab"][actualPos].h_popUID) });
	}
	//set up the x domain for the current sample names 
	this.x.domain(this.masterData["tab"].map(function(d) { return d.s_Sample; }));
	this.y.domain([0,1]);
	//add the axes to the chart
	this.chart.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + this.height + ")")
	      .call(this.xAxis)
	      .selectAll("text")
		    .attr("y", 0)
		    .attr("x", 9)
		    .attr("dy", ".35em")
		    .attr("transform", "rotate(90)")
		    .style("text-anchor", "start")
		    .style("font", "12px sans-serif");
	this.chart.selectAll(".x.axis path").style("display", "none");
	this.chart.append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
      .selectAll("text")
	    .style("font", "12px sans-serif");
	this.chart.selectAll(".axis path")
		.style("fill", "none")
		.style("stroke", "#000")
		.style("shape-rendering", "crispEdges");
	this.chart.selectAll(".axis line")
		.style("fill", "none")
		.style("stroke", "#000")
		.style("shape-rendering", "crispEdges");
			
	var bars = this.chart.selectAll(".bar")
	      .data(this.masterData["tab"]);
	var self = this;
	bars.enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return self.x(d.s_Sample); })
	      .attr("y", function(d) { 
	      	//adjust height for previously added samples 
	      		var ret = self.y(sampleSum[d.s_Sample] + d.c_AveragedFrac);
	      		sampleSum[d.s_Sample] = sampleSum[d.s_Sample] + d.c_AveragedFrac;
	      		return ret; 
	      		})
	      .attr("height", function(d) { return self.height - self.y(d.c_AveragedFrac); })
	      .attr("width", self.x.rangeBand())
	      .attr("fill", function(d){ return self.color(d.h_popUID);})
	      .style("stroke", "#000")
	      .attr("data-legend",function(d) { return d.h_popUID;})
	      .on("mouseover", function(d){
	      	updateTableWithColors(self.hoverTab,samplePopNames[d.s_Sample], ["s_Sample", "h_popUID","c_clusterID", "c_AveragedFrac"]);
	      	 return self.tooltip.style("visibility", "visible");})
		  .on("mousemove", function(){return self.tooltip.style("top", (d3.event.layerY-10)+"px").style("left",(d3.event.layerX+10)+"px");})
		  .on("mouseout", function(){return self.tooltip.style("visibility", "hidden");});
	bars.exit()
		    .remove();
			  //add legend
	this.legend = this.chart.append("g")
				  .attr("class","legend")
				  .attr("transform","translate(" + (this.width - 90) + ",10)")
				  .style("font-size","12px")
				  .call(d3.legend);
	//add legend style directly so download will download it as well
	this.chart.select(".legend-box").style("fill", "#fff");
	this.chart.select(".legend-items").style("fill", "#000");
	
	
	//added a save svg button for the sample chart
	var downLink = this.saveButton.append("a").attr("class", "njhSampleChartImgDownload");
	this.saveButton.on("click", function(){
	  	var html = self.masterSvg
	        .attr("version", 1.1)
	        .attr("xmlns", "http://www.w3.org/2000/svg")
	        .node().parentNode.innerHTML;
	  	//add the svg information to a and then click it to trigger the download
	  	var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
	  	downLink.attr("download", self.downLoadStubName + ".svg");
	  	downLink.attr("href", imgsrc);
	  	downLink.node().click();
	});
}


njhSampleChart.prototype.updateWithData = function(updatedDataTab){
	this.masterData = updatedDataTab;
	this.x.domain(this.masterData["tab"].map(function(d) { return d.s_Sample; }));

	this.color = d3.scale.ordinal()
	    .domain(this.masterData["tab"].map(function(d) { return d.h_popUID; }))
	    .range(this.masterData["popColors"]);
	sampleSum = {};
	samplePopNames = {};
	for(pos in this.masterData["tab"]){
		sampleSum[this.masterData["tab"][pos].s_Sample] = 0;
		samplePopNames[this.masterData["tab"][pos].s_Sample] = [];
	}
	for(pos in this.masterData["tab"]){
		var actualPos = this.masterData["tab"].length - 1 - pos;
		samplePopNames[this.masterData["tab"][actualPos].s_Sample].push({
			s_Sample: this.masterData["tab"][actualPos].s_Sample,
			h_popUID: this.masterData["tab"][actualPos].h_popUID,
			c_clusterID: this.masterData["tab"][actualPos].c_clusterID,
			c_AveragedFrac: this.masterData["tab"][actualPos].c_AveragedFrac,
			color: this.color(this.masterData["tab"][actualPos].h_popUID) });
	}
	//update the x axis
	this.chart.select("g.x.axis")
	      .call(this.xAxis)
	      .selectAll("text")
		    .attr("y", 0)
		    .attr("x", 9)
		    .attr("dy", ".35em")
		    .attr("transform", "rotate(90)")
		    .style("text-anchor", "start")
		    .style("font", "12px sans-serif");
	this.chart.selectAll(".axis line")
		.style("fill", "none")
		.style("stroke", "#000")
		.style("shape-rendering", "crispEdges");
	//get all the bars
	var bars = this.chart.selectAll(".bar").data(this.masterData["tab"]);
	var self = this;
	//create new bars as needed
	bars.enter().append("rect")
	      .attr("class", "bar");
	      
	bars.attr("x", function(d) { return self.x(d.s_Sample); })
	      .attr("y", function(d) { 
	      		var ret = self.y(sampleSum[d.s_Sample] + d.c_AveragedFrac);
	      		sampleSum[d.s_Sample] = sampleSum[d.s_Sample] + d.c_AveragedFrac;
	      		return ret; 
	      		})
	      .attr("height", function(d) { return self.height - self.y(d.c_AveragedFrac); })
	      .attr("width", self.x.rangeBand())
	      .attr("fill", function(d){ return self.color(d.h_popUID);})
	      .style("stroke", "#000")
	      .attr("data-legend",function(d) { return d.h_popUID;})
	      .on("mouseover", function(d){updateTableWithColors(self.hoverTab,samplePopNames[d.s_Sample], ["s_Sample", "h_popUID","c_clusterID", "c_AveragedFrac"]);
	       return self.tooltip.style("visibility", "visible");})
		  .on("mousemove", function(){return self.tooltip.style("top", (d3.event.layerY-10)+"px").style("left",(d3.event.layerX+10)+"px");})
		  .on("mouseout", function(){return self.tooltip.style("visibility", "hidden");});
    //remove the bars no longer needed
	bars.exit().remove();
	//update legend
	this.legend.call(d3.legend);
	
	//add save button
	
};
