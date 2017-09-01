var async = require('async');
var domain = require('domain').create();
var index = require('../');
var log = index.log;
var bitcore = require('bitcore-lib');
var config = bitcore.MongodbAndUnlockConfig;
var _  = bitcore.deps._;
var mongo = require("mongoskin");
var db = mongo.db(config.mongodbconfig.uri, config.mongodbconfig.options);
db.bind("address");
db.bind("lockedTx");

function Unlock(bitcoind){
	var condition = queryCondition(bitcoind,function(err,condition){
		db.lockedTx.find({unlockHeight:{$lt:condition.currHeight}}).toArray(function(err,lockedTxList){			
			if(err){
				log.error("lockedTx err:"+err);
			}
			if(lockedTxList && lockedTxList[0]){
				eacyTxList(lockedTxList,condition);
			}

		})
	});
}

function queryCondition(bitcoind,callback){
	var condition = {};

	bitcoind.getInfo(function(err,info){
		if(err){
			log.error("queryCondition bitcoind.getInfo err:"+err);
			callback(err);
		}
		condition.currHeight = info.blocks;
		callback(err,condition);
	})

}

function isLocked(lockedTxData) {

	if(lockedTxData && lockedTxData.unlockHeight && lockedTxData.unlockHeight>0){
		if(lockedTxData.unlockHeight < config.Unlock.time && lockedTxData.currHeight > config.Unlock.height && lockedTxData.unlockHeight>lockedTxData.blockHightWhenOperation){
			return true;
		}
	}
	return false;
}

function eacyTxList(lockedTxList,condition){

	async.mapSeries(lockedTxList,function(lockTxTmp,callback){
		var lockTx=_.clone(lockTxTmp);
		lockTx.blockHightWhenOperation=condition.currHeight;
		if(!isLocked(lockTx)){
			changeAddressforUnlockTx(lockTx,function(err,result){
				if(err){
					log.error("eacyTxList changeAddressforUnlockTx err:"+err);
					callback(err);
				}
				callback(null);
			});
		}else{
			callback(null);
		}
		
	})
}

function changeAddressforUnlockTx(lockTxObj,callback){
	var condtion = {'address':lockTxObj.address};

	db.address.find(condtion).limit(1).toArray(function(err,addrObj){
		if(err){
			log.error("changeAddressforUnlockTx  err:"+err);
			callback(err);
		}
		else if(addrObj && addrObj[0]){
			addrObj[0].lockedValue -= lockTxObj.value;
			AddressToMongoDB(addrObj[0],lockTxObj,callback);
		}
	})
}

function AddressToMongoDB(addrObj,lockTxObj,callback){

	db.address.update({'address':addrObj.address},{$set:{'lockedValue':addrObj.lockedValue,'Received':addrObj.Received}},function(err,result){
		if(err){
			log.error("AddressToMongoDB update err:"+err);
			callback(err);
		}
		else{
			daleteLockTx(lockTxObj,callback);
		}
	});
}

function daleteLockTx(lockTxObj,callback){
	db.lockedTx.remove({"outputIndex":lockTxObj.outputIndex,"txid":lockTxObj.txid},function(err,result){
		if(err){
			log.error("daleteLockTx remove err:"+err);
			callback(err);
		}
		callback(null);
	})
}

function UnlockTransactions(bitcoind){
	setInterval(function(){
		Unlock(bitcoind);
	},1000 * 60);
}

module.exports = UnlockTransactions;