/*
JavaScript that defines the UI element interactions on the page
Mostly in jQuery, just for simplicity

*/

//Function to be called from the template

function GenerateUI( commodity, zipList )
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
        });
 }