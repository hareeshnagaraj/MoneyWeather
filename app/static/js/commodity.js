/*
JavaScript that defines the UI element interactions on the page
Mostly in jQuery, just for simplicity
*/

/**********PLACEHOLDER GRAPH**************/
/* implementation heavily influenced by http://bl.ocks.org/1166403 */
/* some arguments AGAINST the use of dual-scaled axes line graphs can be found at http://www.perceptualedge.com/articles/visual_business_intelligence/dual-scaled_axes.pdf */

// define dimensions of graph
var m = [80, 80, 80, 80]; // margins
var w = 900 - m[1] - m[3];  // width
var h = 400 - m[0] - m[2]; // height

// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
var data1 = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
var data2 = [543, 367, 215, 56, 65, 62, 87, 156, 287, 398, 523, 685, 652, 674, 639, 619, 589, 558, 605, 574, 564, 496, 525, 476, 432, 458, 421, 387, 375, 368];

// X scale will fit all values from data[] within pixels 0-w
var x = d3.scale.linear().domain([0, data1.length]).range([0, w]);
// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
var y1 = d3.scale.linear().domain([0, 10]).range([h, 0]); // in real world the domain would be dynamically calculated from the data
var y2 = d3.scale.linear().domain([0, 700]).range([h, 0]);  // in real world the domain would be dynamically calculated from the data
    // automatically determining max range can work something like this
    // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

// create a line function that can convert data[] into x and y points
var line1 = d3.svg.line()
    // assign the X function to plot our line as we wish
    .x(function(d,i) { 
        // verbose logging to show what's actually being done
        console.log('Plotting X1 value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        // return the X coordinate where we want to plot this datapoint
        return x(i); 
    })
    .y(function(d) { 
        // verbose logging to show what's actually being done
        console.log('Plotting Y1 value for data point: ' + d + ' to be at: ' + y1(d) + " using our y1Scale.");
        // return the Y coordinate where we want to plot this datapoint
        return y1(d); 
    })
    
// create a line function that can convert data[] into x and y points
var line2 = d3.svg.line()
    // assign the X function to plot our line as we wish
    .x(function(d,i) { 
        // verbose logging to show what's actually being done
        console.log('Plotting X2 value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        // return the X coordinate where we want to plot this datapoint
        return x(i); 
    })
    .y(function(d) { 
        // verbose logging to show what's actually being done
        console.log('Plotting Y2 value for data point: ' + d + ' to be at: ' + y2(d) + " using our y2Scale.");
        // return the Y coordinate where we want to plot this datapoint
        return y2(d); 
    })


    // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select("#graph").append("svg:svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    // create yAxis
    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(false);
    // Add the x-axis.
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);


    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y1).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
          .attr("class", "y axis axisLeft")
          .attr("transform", "translate(-15,0)")
          .call(yAxisLeft);

    // create right yAxis
    var yAxisRight = d3.svg.axis().scale(y2).ticks(6).orient("right");
    // Add the y-axis to the right
    graph.append("svg:g")
          .attr("class", "y axis axisRight")
          .attr("transform", "translate(" + (w+15) + ",0)")
          .call(yAxisRight);
    
    // add lines
    // do this AFTER the axes above so that the line is above the tick-lines
    graph.append("svg:path").attr("d", line1(data1)).attr("class", "data1");
    graph.append("svg:path").attr("d", line2(data2)).attr("class", "data2");
    
/**********END PLACEHOLDER GRAPH**************/

//Function to be called from the template
function GenerateUI( commodityInput, zipList )
    {
        var from_month = "Month";
        var from_year = "Year";
        var to_month = "Month";
        var to_year = "Year";

        var zipCodes = zipList;
        console.log(zipCodes)

        $('ul#from_month li').click(function(e) 
        { 
            from_month = $(this).find("a").text();
            $("#from_month_label").text(from_month)
        });
        $('ul#from_year li').click(function(e) 
        { 
            from_year = $(this).find("a").text();
            $("#from_year_label").text(from_year)
        });
        $('ul#to_month li').click(function(e) 
        { 
            to_month = $(this).find("a").text();
            $("#to_month_label").text(to_month)
        });
        $('ul#to_year li').click(function(e) 
        { 
            to_year = $(this).find("a").text();
            $("#to_year_label").text(to_year)
        });

        //Makes the call to load in the appropriate weather data necessary
        $("#generateButton").click(function(){
            if(from_month == "Month" || from_year == "Year" || to_month == "Month" || to_year == "Year"){
                window.alert("Please enter a valid time range");
                return ;
            }
            console.log("Valid time range"); 
            //Sending request for data to server -- 
            $.ajax({
                method : "POST",
                url : "/pagedata",
                data : {
                    commodity : commodityInput,
                    from_month : from_month,
                    from_year : from_year,
                    to_month : to_month,
                    to_year : to_year, 
                    zipCodes : zipList
                }, 
                success: function(data){
                    console.log(data);
                    d3update(data, from_month, from_year, to_month, to_year);
                },
                error: function(data){
                    console.log("error")
                    console.log(data);
                }

            });

        });
 }

//Function to update the d3js UI appropriately
//Time bounds are passed in here to simplify routes.py

//TODO : account for MULTIPLE ZIP CODES by AVERAGING

function d3update( data , from_month, from_year, to_month, to_year){
    var xLabels = [];                              //this will be defined by the valid weather data range
    var weather = data['packet']['weather'];      //weather data sent from server
    var commodityPrice = data['packet']['commodityPrice'];      //commodity price
    var numZips = 0;                                //Used to average out weather data if multiple zips present
    var meanTempData = [];
    var meanPrecipData = [];
    var meanHumidityData = [];
    var priceDataPoints = [];
    var temp, precipitation, humidity, month, year;

    var maxMeanTemp = 0;
    var maxPrice = 0;

    //Aggregating weather for each zipcode
    for(var zipcode in weather){
        zipweather = weather[zipcode];      //Getting weather for a specific month

        //Parsing weather data
        for(var i = 0; i < zipweather.length; i++){
            point = zipweather[i];
            //Dealing with the X labels, defined by weather points NOT commodity
            temp = cutoffDecimal(point[0]);
            precipitation = cutoffDecimal(point[1]);
            humidity = cutoffDecimal(point[2]);
            month = point[3];
            year = point[4]
            dateString = point[3].toString() + "-" + point[4].toString();
            if(year == to_year && month > to_month){ break; }

            if((year == from_year && month >= from_month) || (year > from_year)){  
                if(temp > maxMeanTemp)
                    maxMeanTemp = temp; //updating the max mean temp for left y axis
                xLabels.push(dateString);
                meanTempData.push(temp);
                meanPrecipData.push(precipitation);
                meanHumidityData.push(humidity)
            }

            numZips++;
        }
        console.log("final weather data")
        console.log(xLabels);
        console.log(meanTempData);
        console.log(meanPrecipData);
        console.log(meanHumidityData);
    }

    console.log("commodity price data gathering --");
    for(var i = 0; i < commodityPrice.length; i++){
        console.log(commodityPrice[i])
        pricePoint = commodityPrice[i];
        price = cutoffDecimal(pricePoint[0]);
        month = pricePoint[1];
        year = pricePoint[2];
        if(year == to_year && month > to_month){ break; }
        if((year == from_year && month >= from_month) || (year > from_year)){
            if(price > maxPrice)
                maxPrice = price            //updating maximum price for right y axis
            priceDataPoints.push(price);
        }
    }

    //Updating the d3 graph appropriately 
    x = d3.scale.linear().domain([0, xLabels.length]).range([0, w]);    //x axis represents months since start
    y1 = d3.scale.linear().domain([0, maxMeanTemp]).range([h, 0]);      //updating the left axis with meantemp
    y2 = d3.scale.linear().domain([0, maxPrice]).range([h, 0]);         //updating right axis with price
    xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(false);
    yAxisLeft = d3.svg.axis().scale(y1).ticks(10).orient("left");
    yAxisRight = d3.svg.axis().scale(y2).ticks(10).orient("right");
    // Select the section we want to apply our changes to
    svg = d3.select("#graph").transition();
    
    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);

    svg.select(".y.axis.axisLeft") // change the left y axis
        .duration(750)
        .call(yAxisLeft);

    svg.select(".y.axis.axisRight") // change the right y axis
        .duration(750)
        .call(yAxisRight);

    graph.append("text")      // text label for the x axis
        .attr("x", 300 )
        .attr("y", 300 )
        .style("text-anchor", "middle")
        .text("Months From Start");
}

function cutoffDecimal(figure, decimals){
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
};