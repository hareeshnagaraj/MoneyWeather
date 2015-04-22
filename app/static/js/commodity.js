/*
JavaScript that defines the UI element interactions on the page
Mostly in jQuery, just for simplicity

*/

//Globals
var from_month;
var from_year;
var to_month;
var to_year;

$(document).ready(function() 
 {
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
 });