/*
JavaScript that defines the UI element interactions on the page
Mostly in jQuery, just for simplicity
--Hareesh Nagaraj
*/

/**********PLACEHOLDER GRAPH**************/
/* implementation heavily influenced by http://bl.ocks.org/1166403 */
/* some arguments AGAINST the use of dual-scaled axes line graphs can be found at http://www.perceptualedge.com/articles/visual_business_intelligence/dual-scaled_axes.pdf */

// define dimensions of graph
var m = [80, 80, 80, 80]; // margins
var w = 1000 - m[1] - m[3];  // width
var h = 500 - m[0] - m[2]; // height

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
var priceLog = data2;
// create a line function that can convert data[] into x and y points
var line1 = d3.svg.line()
    // assign the X function to plot our line as we wish
    .x(function(d,i) { 
        // verbose logging to show what's actually being done
        //console.log('Plotting X1 value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        // return the X coordinate where we want to plot this datapoint
        return x(i); 
    })
    .y(function(d) { 
        // verbose logging to show what's actually being done
        //console.log('Plotting Y1 value for data point: ' + d + ' to be at: ' + y1(d) + " using our y1Scale.");
        // return the Y coordinate where we want to plot this datapoint
        return y1(d); 
    })
    
// create a line function that can convert data[] into x and y points
var line2 = d3.svg.line()
    // assign the X function to plot our line as we wish
    .x(function(d,i) { 
        // verbose logging to show what's actually being done
        //console.log('Plotting X2 value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        // return the X coordinate where we want to plot this datapoint
        return x(i); 
    })
    .y(function(d) { 
        // verbose logging to show what's actually being done
        //console.log('Plotting Y2 value for data point: ' + d + ' to be at: ' + y2(d) + " using our y2Scale.");
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
    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
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

    //adding axis labels 
    graph.append("text")
        .attr("class","weatherAxis")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - m[0])
        .attr("x",0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Mean Temperature (Fahrenheit)");

    graph.append("text")
        .attr("transform", "rotate(90)")
        .attr("class","priceAxisLabel")
        .attr("y", 0- w - 80)
        .attr("x", (h/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Commodity Price");

    graph.append("text")      // text label for the x axis
        .attr("x", 400 )
        .attr("y", 400 )
        .style("text-anchor", "middle")
        .text("Months From Start");
    
/**********END PLACEHOLDER GRAPH**************/

//Function to be called from the template
//Generates the d3 values, and binds the listeners appropriatley for user interaction
function GenerateUI( commodityInput, zipList , units, dataSource, dataLocation)
    {
        var from_month = "Month";
        var from_year = "Year";
        var to_month = "Month";
        var to_year = "Year";

        var zipCodes = zipList;
        console.log(zipCodes);
        console.log(units)
        console.log(dataSource);

        svg = d3.select("#graph").transition();
        svg.select(".priceAxisLabel") // change the left y axis domain
            .duration(750)
            .text("Commodity Price  (per " + units + ")");

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

        //Modal triggers
        $('.modal-trigger').leanModal();
        $("#modalButton").click(function(){
            $("#modal1").openModal();
        });

        //Updating the description UI with the appropriate information
        $("#dataSource").text(dataSource);
        $("#dataLocation").text(dataLocation);
        $("#descriptionContainer").fadeIn(500);



        //Makes the call to load in the appropriate weather data necessary
        $("#generateButton").click(function(){
            //Enabling precip, humidity buttons
            $("#meanprecip").unbind("click");
            $("#meanhumidity").unbind("click");
            $("#meantemp").unbind("click");
            $("#meanprecip").removeClass("disabled");
            $("#meanhumidity").removeClass("disabled");
            $("#meantemp").removeClass("green");
            $("#meanprecip").addClass("green");
            $("#meanhumidity").addClass("green");
            $("#meantemp").addClass("disabled");

            if(from_month == "Month" || from_year == "Year" ||
                 to_month == "Month" || to_year == "Year" ||
                 to_year < from_year || (to_year == from_year && to_month <= from_month)){
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

function makeArrayOf(value, length) {
  var arr = [], i = length;
  while (i--) {
    arr[i] = value;
  }
  return arr;
}

//Function to update the d3js UI appropriately
//Time bounds are passed in here to simplify routes.py

//TODO : account for MULTIPLE ZIP CODES by AVERAGING


function d3update( data , from_month, from_year, to_month, to_year ){
    var xLabels = [];                              //this will be defined by the valid weather data range
    var weather = data['packet']['weather'];      //weather data sent from server
    var commodityPrice = data['packet']['commodityPrice'];      //commodity price
    var numZips = 0;                                //Used to average out weather data if multiple zips present
    var meanTempData = [];
    var meanPrecipData = [];
    var meanHumidityData = [];
    var priceDataPoints = [];
    var logPriceDataPoints = [];
    var temp, precipitation, humidity, month, year;
    var priceStandardDeviation, priceMean, priceVariance;
    var weatherStandardDeviation, weatherMean, weatherVariance;
    var linRegression, m, b, line, r_squared, regval, beta1, beta2, error;

    var maxMeanTemp = 0;
    var maxMeanPrecip = 0;
    var maxMeanHumidity = 0;
    var maxPrice = -1;
    var maxLogPrice = -1;
    var minPrice = 9007199254740992;        //Largest possible number in JS
    var minLogPrice = 9007199254740992;
    var minMeanTemp = 9007199254740992;
    var minMeanPrecip = 9007199254740992;
    var minMeanHumidity = 9007199254740992;

    //Aggregating weather for each zipcode
    // console.log("FIRST THING " + weather[0])
    // console.log(weather)
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
                if(+temp > +maxMeanTemp)
                    maxMeanTemp = temp; //updating the max mean temp for left y axis
                if(+precipitation > +maxMeanPrecip)
                    maxMeanPrecip = precipitation;
                if(+humidity > +maxMeanHumidity)
                    maxMeanHumidity = humidity;
                
                if(+temp < +minMeanTemp)
                    minMeanTemp = temp; //updating the min mean temp for left y axis
                if(+precipitation < +minMeanPrecip)
                    minMeanPrecip = precipitation;
                if(+humidity < +minMeanHumidity)
                    minMeanHumidity = humidity;
                
                xLabels.push(dateString);
                meanTempData.push(temp);
                meanPrecipData.push(precipitation);
                meanHumidityData.push(humidity);
                // if(!meanPrecipData[i]){
                //     meanPrecipData.push(precipitation);
                //     console.log("pushing : " + precipitation)
                // } else { meanPrecipData[i] += precipitation }
            }

            numZips++;
        }
        // console.log("final weather data")
        // console.log(xLabels);
        // console.log(meanTempData);
        // console.log(meanPrecipData);
        // console.log(meanHumidityData);
    }

    // console.log("commodity price data gathering --");
    for(var i = 0; i < commodityPrice.length; i++){
        // console.log(commodityPrice[i])
        pricePoint = commodityPrice[i];
        price = cutoffDecimal(pricePoint[0]);
        logPrice = Math.log(pricePoint[0]);
        month = pricePoint[1];
        year = pricePoint[2];
        if(year == to_year && month > to_month){ break; }
        if((year == from_year && month >= from_month) || (year > from_year)){
            if(+maxPrice < +price){         // NOTE : + operator converts to ints
                maxPrice = price            //updating maximum price for right y axis
            }
            if(+minPrice > +price){
                minPrice = price            //updating maximum price for right y axis
            }
            if(+maxLogPrice < +logPrice){         // NOTE : + operator converts to ints
                maxLogPrice = logPrice            //updating maximum price for right y axis
            }
            if(+minLogPrice > +logPrice){
                minLogPrice = logPrice            //updating maximum price for right y axis
            }
            priceDataPoints.push(price);
            logPriceDataPoints.push(logPrice);
        }
    }

    //Updating the basic descrpitive statistics
    priceStandardDeviation = ss.standard_deviation(priceDataPoints);
    priceMean = ss.mean(priceDataPoints);
    priceVariance = ss.variance(priceDataPoints);
    weatherStandardDeviation = ss.standard_deviation(meanTempData);
    weatherMean = ss.mean(meanTempData);
    weatherVariance = ss.variance(meanTempData)
    regval = getMultipleRegEquationValues(meanTempData, meanPrecipData, meanHumidityData, priceDataPoints);
    
    
    //Updating the UI with the descriptive stats
    $("#priceStats").show();
    $("#priceMean").text("Mean : " + cutoffDecimal(priceMean));
    $("#priceStandardDev").text("Standard Deviation : " + cutoffDecimal(priceStandardDeviation));
    $("#priceVariance").text("Variance : " + cutoffDecimal(priceVariance));
    $("#weatherStatsTitle").text("Descriptive Mean Temp. Statistics:");
    $("#weatherMean").text("Mean : " + cutoffDecimal(weatherMean));
    $("#weatherStandardDev").text("Standard Deviation : " + cutoffDecimal(weatherStandardDeviation));
    $("#weatherVariance").text("Variance : " + cutoffDecimal(weatherVariance));
    
    beta1 = cutoffDecimal(regval['beta1'],5);
    beta2 = cutoffDecimal(regval['beta2'],5);
    beta3 = cutoffDecimal(regval['beta3'],5);
    error = cutoffDecimal(regval['error'],5);
    $("#multRegBeta1").text("Beta 1 : " + beta1);
    $("#multRegBeta2").text("Beta 2 : " + beta2);
    $("#multRegBeta3").text("Beta 3 : " + beta3);
    $("#multRegError").text("Error : " + error);
    $("#multRegEquation").text("y = " + beta1 +"x1 + " + beta2 + "x2 + " + beta3 + "x3 + " + error);

    //Performing a linear regression on the two variables   
    linRegression = regressionLine(meanTempData,priceDataPoints);
    m = linRegression.m();
    b = linRegression.b();
    line = linRegression.line();
    r_squared = ss.r_squared(getDataPairs(meanTempData,priceDataPoints), 
                                            function(x) { 
                                                return m*x + b ;
                                            });
    // console.log("rsquared");
    // console.log(r_squared);


    $("#linRegTitle").show();
    $("#linRegM").text("m = " + cutoffDecimal(m));
    $("#linRegB").text("b = " + cutoffDecimal(b));
    $("#linRegEquation").text("y = " + cutoffDecimal(m) + "x + " + cutoffDecimal(b));
    $("#linRSquared").text("r^2 = " + cutoffDecimal(r_squared));

    //Updating the calculator area
    $("#modalPrompt").text("Input a Mean Temp. Value (Fahrenheit)");
    $("#modalButton").text("Input Temp. Values");


    //Updating the d3 graph appropriately 
    x = d3.scale.linear().domain([0, xLabels.length]).range([0, w]);    //x axis represents months since start
    y1 = d3.scale.linear().domain([minMeanTemp, maxMeanTemp]).range([h, 0]);      //updating the left axis with meantemp
    y2 = d3.scale.linear().domain([minPrice, maxPrice]).range([h, 0]);         //updating right axis with price
    xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(false);
    yAxisLeft = d3.svg.axis().scale(y1).ticks(10).orient("left");
    yAxisRight = d3.svg.axis().scale(y2).ticks(10).orient("right");
    // Select the section we want to apply our changes to
    svg = d3.select("#graph").transition();
    
    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);

    svg.select(".y.axis.axisLeft") // change the left y axis domain
        .duration(750)
        .call(yAxisLeft);

    svg.select(".y.axis.axisRight") // change the right y axis domain 
        .duration(750)
        .call(yAxisRight);

    svg.select(".data1") // change the left y axis domain
        .duration(750)
        .attr("d", line1(meanTempData));

    svg.select(".data2") // change the left y axis domain
        .duration(750)
        .attr("d", line2(priceDataPoints));
    
    svg.select(".weatherAxis") // change the left y axis domain
        .duration(750)
        .text("Mean Temperature (Fahrenheit)");

    console.log("x length")
    // console.log(x.length);
    // console.log(x);

    /*----- Multivariate Regression Test ------*/

    
    //Button listeners to update data dynamically
    //unbinding click listeners
    $("#meanprecip").unbind("click");
    $("#meanhumidity").unbind("click");
    $("#meantemp").unbind("click");
    $("#logpricebutton").unbind("click");

    //Enabling precip, humidity buttons
    $("#meanprecip").removeClass("disabled");
    $("#meanhumidity").removeClass("disabled");
    $("#logpricebutton").removeClass("disabled");
    $("#meanprecip").addClass("green");
    $("#meanhumidity").addClass("green");
    $("#logpricebutton").addClass("green");


    $("#meanhumidity").click(function(){
        $("#meanhumidity").removeClass("green");
        $("#meanhumidity").addClass("disabled");
        $("#meanprecip").removeClass("disabled");
        $("#meanprecip").addClass("green");
        $("#meantemp").removeClass("disabled");
        $("#meantemp").addClass("green");

        weatherStandardDeviation = ss.standard_deviation(meanHumidityData);
        weatherMean = ss.mean(meanHumidityData);
        weatherVariance = ss.variance(meanHumidityData);
        $("#weatherStatsTitle").text("Descriptive Mean Humidity. Statistics:");
        $("#weatherMean").text("Mean : " + cutoffDecimal(weatherMean));
        $("#weatherStandardDev").text("Standard Deviation : " + cutoffDecimal(weatherStandardDeviation));
        $("#weatherVariance").text("Variance : " + cutoffDecimal(weatherVariance));

        linRegression = regressionLine(meanHumidityData,priceDataPoints);
        m = linRegression.m();
        b = linRegression.b();
        line = linRegression.line();
        r_squared = ss.r_squared(getDataPairs(meanHumidityData,priceDataPoints), 
                                            function(x) { 
                                                return m*x + b ;
                                            });

        $("#linRegTitle").show();
        $("#linRegM").text("m = " + cutoffDecimal(m));
        $("#linRegB").text("b = " + cutoffDecimal(b));
        $("#linRegEquation").text("y = " + cutoffDecimal(m) + "x + " + cutoffDecimal(b));
        $("#linRSquared").text("r^2 = " + cutoffDecimal(r_squared,4));
        //Updating the calculator area
        $("#modalPrompt").text("Input a Mean Humidity Value (%)");
        $("#modalButton").text("Input Humidity Values");

        svg = d3.select("#graph").transition();
        svg.select(".weatherAxis") // change the left y axis domain
            .duration(750)
            .text("Mean Humidity (%)");

        y1 = d3.scale.linear().domain([minMeanHumidity, maxMeanHumidity]).range([h, 0]);      //updating the left axis with meantemp
        yAxisLeft = d3.svg.axis().scale(y1).ticks(10).orient("left");

        svg.select(".y.axis.axisLeft") // change the left y axis domain
            .duration(750)
            .call(yAxisLeft);

        svg.select(".data1") // change the left y axis domain
            .duration(750)
            .attr("d", line1(meanHumidityData));
    });


    $("#meanprecip").click(function(){
        $("#meanprecip").removeClass("green");
        $("#meanprecip").addClass("disabled");
        $("#meanhumidity").removeClass("disabled");
        $("#meanhumidity").addClass("green");
        $("#meantemp").removeClass("disabled");
        $("#meantemp").addClass("green");

        weatherStandardDeviation = ss.standard_deviation(meanPrecipData);
        weatherMean = ss.mean(meanPrecipData);
        weatherVariance = ss.variance(meanPrecipData);
        $("#weatherStatsTitle").text("Descriptive Mean Precip. Statistics:");
        $("#weatherMean").text("Mean : " + cutoffDecimal(weatherMean));
        $("#weatherStandardDev").text("Standard Deviation : " + cutoffDecimal(weatherStandardDeviation));
        $("#weatherVariance").text("Variance : " + cutoffDecimal(weatherVariance));

        linRegression = regressionLine(meanPrecipData,priceDataPoints);
        m = linRegression.m();
        b = linRegression.b();
        line = linRegression.line();
        r_squared = ss.r_squared(getDataPairs(meanPrecipData,priceDataPoints), 
                                            function(x) { 
                                                return m*x + b ;
                                            });
        $("#linRegTitle").show();
        $("#linRegM").text("m = " + cutoffDecimal(m));
        $("#linRegB").text("b = " + cutoffDecimal(b));
        $("#linRegEquation").text("y = " + cutoffDecimal(m) + "x + " + cutoffDecimal(b));
        $("#linRSquared").text("r^2 = " + cutoffDecimal(r_squared,4));

        //Updating the calculator area
        $("#modalPrompt").text("Input a Mean Precipitation Value (Inches)");
        $("#modalButton").text("Input Precip. Values");

        svg = d3.select("#graph").transition();
        svg.select(".weatherAxis") // change the left y axis domain
            .duration(750)
            .text("Mean Precipitation (Inches)");

        y1 = d3.scale.linear().domain([minMeanPrecip, maxMeanPrecip]).range([h, 0]);      //updating the left axis with meantemp
        yAxisLeft = d3.svg.axis().scale(y1).ticks(10).orient("left");

        svg.select(".y.axis.axisLeft") // change the left y axis domain
            .duration(750)
            .call(yAxisLeft);

        svg.select(".data1") // change the left y axis domain
            .duration(750)
            .attr("d", line1(meanPrecipData));
    });

    $("#meantemp").click(function(){
        $("#meantemp").removeClass("green");
        $("#meantemp").addClass("disabled");
        $("#meanhumidity").removeClass("disabled");
        $("#meanhumidity").addClass("green");
        $("#meanprecip").removeClass("disabled");
        $("#meanprecip").addClass("green");

        weatherStandardDeviation = ss.standard_deviation(meanTempData);
        weatherMean = ss.mean(meanTempData);
        weatherVariance = ss.variance(meanTempData);
        $("#weatherStatsTitle").text("Descriptive Mean Temp. Statistics:");
        $("#weatherMean").text("Mean : " + cutoffDecimal(weatherMean));
        $("#weatherStandardDev").text("Standard Deviation : " + cutoffDecimal(weatherStandardDeviation));
        $("#weatherVariance").text("Variance : " + cutoffDecimal(weatherVariance));

        linRegression = regressionLine(meanTempData,priceDataPoints);
        m = linRegression.m();
        b = linRegression.b();
        line = linRegression.line();
        r_squared = ss.r_squared(getDataPairs(meanTempData,priceDataPoints), 
                                            function(x) { 
                                                return m*x + b ;
                                            });

        $("#linRegTitle").show();
        $("#linRegM").text("m = " + cutoffDecimal(m));
        $("#linRegB").text("b = " + cutoffDecimal(b));
        $("#linRegEquation").text("y = " + cutoffDecimal(m) + "x + " + cutoffDecimal(b));
        $("#linRSquared").text("r^2 = " + cutoffDecimal(r_squared,4));

        //Updating the calculator area
        $("#modalPrompt").text("Input a Mean Temp. Value (Fahrenheit)");
        $("#modalButton").text("Input Temp. Values");
        
        svg = d3.select("#graph").transition();
        svg.select(".weatherAxis") // change the left y axis domain
            .duration(750)
            .text("Mean Temperature (Fahrenheit)");

        y1 = d3.scale.linear().domain([minMeanTemp, maxMeanTemp]).range([h, 0]);
        yAxisLeft = d3.svg.axis().scale(y1).ticks(10).orient("left"); 

        svg.select(".y.axis.axisLeft") // change the left y axis domain
            .duration(750)
            .call(yAxisLeft);

        svg.select(".data1") // change the left y axis domain
            .duration(750)
            .attr("d", line1(meanTempData));
    });
    

    //Creating the calculator values
    $("#calcButton").click(function(){
        var inputVal = +$("#weatherInputValue").val();
        console.log(inputVal);
        if(inputVal.toString() == "NaN"){
            window.alert("please enter a valid number");
            return ;
        }
        $("#calcOutput").text("$" + cutoffDecimal(line(inputVal)));
    });
    $("#calcButton2").click(function(){
        var tempVal = +$("#multWeatherVal").val();
        var precipVal = +$("#multPrecipVal").val();
        var humidityVal = +$("#multHumidityVal").val();
        
        if(tempVal.toString() == "NaN" || precipVal.toString() == "NaN"){
            window.alert("please enter a valid number");
            return ;
        }
        console.log('calc2 finding');
        console.log(beta1 * tempVal);
        console.log(beta2 * precipVal);
        console.log(beta3 * humidityVal)
        var yValue = (+beta1) * tempVal + (+beta2) * precipVal + (+beta3) * humidityVal + (+error);
        $("#multCalcOutput").text("$" + cutoffDecimal(priceMean + yValue));
    });
}

//Example usage : getMultipleRegEquationValues(meanTempData, priceDataPoints)
//NOTE : Fix this by changing the values 
//TODO : BREAK UP X1, X2, X3 AS INDEPENDENT VARIABLES
//       X1 = TEMP, X2 = PRECIP, X3 = HUMIDITY
function getMultipleRegEquationValues(data1, data2, data3, data4){
    var returnValues = {};
    console.log(data3);
    var xMatrix = new Matrix(getMultRegDataTriples(data1, data2, data3));
    var yMatrix = new Matrix(getMultRegYValues(data4));
    var errorValues = [];
    console.log(xMatrix);
    console.log(yMatrix);
    var coefficients = yMatrix.regression_coefficients(xMatrix)['mtx'];
    console.log(coefficients);
    var beta1 = coefficients[0][0];
    var beta2 = coefficients[1][0];
    var beta3 = coefficients[2][0];
    var errArray = [];
    var error;
    // console.log(beta1 + " " + beta2);
    returnValues['beta1'] = beta1;
    returnValues['beta2'] = beta2;
    returnValues['beta3'] = beta3;
    for(var i = 0; i < data2.length; i++){
        error = data2[i] - beta1*data1[i] - beta2*i;
        errArray.push(error);
    }
    // console.log(ss.mean(errArray));
    returnValues['error'] = ss.mean(errArray)/data2.length;
    return returnValues
}

function getMultRegYValues(data){
    var regInput = [];
    var regPoint;
    for(var i = 0; i < data.length; i++){
        regPoint = [data[i]];
        regInput.push(regPoint);
    }
    return regInput;
}

function getMultRegDataTriples(data1, data2, data3){
    var regInput = [];
    var regPoint;
    for(var i = 0; i < data1.length; i++){
        regPoint = [data1[i], data2[i], data3[i]];
        regInput.push(regPoint);
    }
    return regInput;
}

function getDataPairs(xData, yData){
    var regInput = [];
    var regPoint;
    for(var i = 0; i < xData.length; i++){
        regPoint = [xData[i], yData[i]];
        regInput.push(regPoint);
    }
    return regInput;
}

function regressionLine(xData, yData){
    var regInput = [];
    var regPoint;
    for(var i = 0; i < xData.length; i++){
        regPoint = [xData[i], yData[i]];
        regInput.push(regPoint);
    }
    var regression = ss.linear_regression().data(regInput);
    return regression;
}

function cutoffDecimal(figure, decimals){
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (+parseFloat(figure*d)/d).toFixed(decimals);
};