var fs = require('fs');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test',function(err){
	if(err) console.log('database error');
})

// lng, lat
var ParkSchema = mongoose.Schema({parkid:String,
	                              name:String, 
	                              geo: {type: [Number,Number], index: '2d'},
	                              street:String,
	                              state: Number,
	                              type:String,
	                              reserved:{userID:String, 
	                            	        startTime:Number},
	                              current:{userID:String, startTime:Number, dueTime:Number}	                              
	                            });



var ParkModel = mongoose.model('Park',ParkSchema);
exports.ParkModel = ParkModel;
exports.ParkSchema = ParkSchema;


exports.getParks = function(req,res){
	console.log('get Parking');
	
	ParkModel.find({},function(err,data){
		if (err) throw err;
		else{
		    //res.header("Content-Type:","application/json");
		    //res.send(data);
			console.log(data);
			res.render('parklist',{
		        locals: { data: data  }                
		      });
		}      			
		
	})	

}


exports.searchParkByGeo = function(req,res){
	console.log('search Parking');
	console.log(req.params.lat+"   "+req.params.lon+"    "+req.params.dist);
	// [44.441,44.442]
	ParkModel.find({'geo' : { '$near' : [req.params.lon,req.params.lat], '$maxDistance' : 500/68.91}},function(err,data){
		if (err) throw err;
		else{
			console.log(data);
		    res.header("Content-Type:","application/json");
		    res.send(data);			
		} 
	})

}

/**********************************************************
 * 
 *             middleware
 * 
 *********************************************************/

ParkSchema.pre('update',function(next){
	console.log('update');
	next();
})

ParkSchema.pre('save',function(next){
	console.log('save');
	next();
})



/**********************************************************
 * 
 *             admin operation
 * 
 *********************************************************/

exports.deletePark = function(req,res){
	console.log('delete Parking   '+req.params.id);
	ParkModel.remove({'parkid':req.params.id},function(err,data){
		if (err) throw err;
		else{
		    res.header("Content-Type:","application/json");
		    res.send([]);			
		}
	})
}

exports.setPark = function(req,res){
	console.log('set Parking');
	console.log(req.body.name+"  "+req.body.lat+"   "+req.body.lng);
	ParkModel.create({'parkid':req.body.name,'geo':[req.body.lng,req.body.lat]},function(err,data){
		if (err) throw err;
		else{
		    res.header("Content-Type:","application/json");
		    res.send(data);			
		}		
	})
}


/************************************************************************
 * 
 * 
 *                 user operation
 * 
 ************************************************************************/

exports.getParkStatus = function(req,res){
	console.log('get Parking  id: '+req.params.id);
	ParkModel.findOne({'parkid':req.params.id},function(err,data){
		if (err) throw err;
		else{
			if(data){
			    res.header("Content-Type:","application/json");
			    res.send(data);
			}else
			{
				res.send('data null');
			}
		}
		
	})	
}

function updateParkStatus(query,update,callback){
	ParkModel.update(query,update,function(err,data){
		 if (err) callback(err,null);
		 else
	     callback(null,null);
	})		
}

exports.reservePark = function(req,res){
	console.log('reserve Park   '+req.body.parkID+"   "+req.body.userID+"    "+req.body.timeStart+"   "+req.body.timeEnd);
	updateParkStatus({'parkid':req.body.parkID},{'$set':{'reserved':{'userID':req.body.userID,'startTime':startTime,'dueTime':dueTime},'state':2}},function(err,data){
		if (err) throw err;
		else{
			if(data==null) 
			{
				console.log('out park  '+data);
			    res.header("Content-Type:","application/json");
			    res.send('update == null');   				
			}
			else{
				ParkModel.find({},'parkid geo current state',{'limit':30,'skip':0},function(err,data){
					if (err) throw err;
				    res.header("Content-Type:","application/json");
				    res.send(data);		
				})				
			}	
		}		
	})		
}

function reservationFinished(parkID){
	updateParkStatus({'parkid':parkID},{'$unset':{'reserved':null},'$set':{'state':0}},function(err,data){
		if (err) throw err;
		else{
				ParkModel.find({},'parkid geo current state',{'limit':30,'skip':0},function(err,data){
					if (err) throw err;
				    res.header("Content-Type:","application/json");
				    res.send(data);		
				})				
				
		}		
	})
}



exports.inPark = function(req,res){
	console.log('in Park   '+req.body.parkID+"   "+req.body.userID+"    "+req.body.timeStart+"   "+req.body.timeEnd);
    console.log(new Date().getTime()+1*60*60);
    
    var startTime = new Date().getTime();
    var dueTime = startTime + 1*60*60;
    
	updateParkStatus({'parkid':req.body.parkID},{'$set':{'current':{'userID':req.body.userID,'startTime':startTime,'dueTime':dueTime},'state':1}},function(err,data){
		if (err) throw err;
		else{
				ParkModel.find({},'parkid geo current state',{'limit':30,'skip':0},function(err,data){
					if (err) throw err;
				    res.header("Content-Type:","application/json");
				    res.send(data);		
				})				
			
		}		
	})
}

exports.outPark = function(req,res){
	console.log('out Park   '+req.body.parkID+"   "+req.body.userID+"    "+req.body.timeStart+"   "+req.body.timeEnd);
	
	updateParkStatus({'parkid':req.body.parkID},{'$unset':{'current':{'userID':req.body.userID}},'$set':{'state':0}},function(err,data){
		if (err) throw err;
		else{
				ParkModel.find({},'parkid geo current state',{'limit':30,'skip':0},function(err,data){
					if (err) throw err;
				    res.header("Content-Type:","application/json");
				    res.send(data);		
				})				
			
		}		
	})
}




function createNewPark(park,callback){
	ParkModel.create(park,function(err,data){
		if(err) callback(err,null);
		else callback(null,data);
	})
}

function findParks(condition,option,callback){
	ParkModel.find(condition,option,function(err,data){
		if(err) { console.log('find parks error');  callback(err,null) }
		else callback(null,data);
	})
}