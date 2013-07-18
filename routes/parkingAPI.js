var app = require('../app').app;
var GridFS = require('../app').GridFS

var config = require('../conf/config.js');
var	gridfs = require("./gridfs");

var crypto = require('crypto');
var fs = require('fs');

var moment = require('moment');
require('colors');
var async = require('async');
var check = require('validator').check,
    sanitize = require('validator').sanitize;

//var query = require('query');
	
/*
id: String
type: String, (type of the car parking, for example, outdoor, indoor, onstreet)
geo: Array [lat,lng]
location: String
rate: Number
timestamp: Timestamp
last_data_updated: Timestamp
sum: Number
availbility: Number
payment_option: Array (credit card, coins, smart phone)
facility: Array (camera, sensor)
map: (the 2d map of the parking)
*/
	
	
	
//This part of API is used for user who searchs for the available parking space

app.get('/parkings', getParkings);

function getParkings(req, res) {
    /* get query or para */
	/*console.log('query',req.lag,req.lng,req.dis);*/
	var lag = req.lag, lng = req.lng, dis = req.dis;
	var data = [{'id':'English',
	             'type':'outdoor',
				 'geo':'Array',
				 'location':'String',
				 'rate':'Number',
				 'timestamp':'Timestamp',
				 'last_data_updated':'Timestamp',
				 'sum':'Number',
				 'availbility':'Number',
				 'payment_option':'Array',
				 'facility':'Array',
				 }];
    res.json(data);
	res.send('getParkings');
	}
	
	
app.get('/searchParkingByDistance', getSearchParkingByDistance);


function getSearchParkingByDistance(req, res) {
    /*search parking by distance*/
	/*console.log('query',req.lag,req.lng,req.dis);*/
	var lag = req.lag, lng = req.lng, dis = req.dis;
	var data = [{'id':'English',
	             'type':'outdoor',
				 'geo':'Array',
				 'location':'String',
				 'rate':'Number',
				 'timestamp':'Timestamp',
				 'last_data_updated':'Timestamp',
				 'sum':'Number',
				 'availbility':'Number',
				 'payment_option':'Array',
				 'facility':'Array',
	             }];
	res.json(data);
	res.send('Search Parking By Distance');
	}
	
	
app.get('/searchParkingByLocation', getSearchParkingByLocation);


function getSearchParkingByLocation(req, res) {
    /*search parking by location*/
	/*console.log('query',req.lag,req.lng,req.dis);*/
	var lag = req.lag, lng = req.lng, dis = req.dis;
	var data = [{'id':'English',
	             'type':'outdoor',
				 'geo':'Array',
				 'location':'String',
				 'rate':'Number',
				 'timestamp':'Timestamp',
				 'last_data_updated':'Timestamp',
				 'sum':'Number',
				 'availbility':'Number',
				 'payment_option':'Array',
				 'facility':'Array',
	             }];
	res.json(data);
	res.send('search parking by location');
	}
	
app.get('/detailParking', getSpecificParking);
	
	
function getSpecificParking(req, res) {
	/*get detail of specific parking*/
    console.log('query',req.lag,req.lng,req.dis);
	var lag = req.lag, lng = req.lng, dis = req.dis;
	var data = [{'id':'English',
	             'type':'outdoor',
		         'geo':'Array',
		 	     'location':'String',
			     'rate':'Number',
			     'timestamp':'Timestamp',
				 'last_data_updated':'Timestamp',
			     'sum':'Number',
			     'availbility':'Number',
			     'payment_option':'Array',
			     'facility':'Array',
		         }];
	res.json(data);
	res.send('getSpecificParking');
	}
	



	

	
