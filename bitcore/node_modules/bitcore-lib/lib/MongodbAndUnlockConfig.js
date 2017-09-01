module.exports = {
		mongodbconfig:{
			uri : "mongodb://localhost:27017/bitcore",
			options : {
				server : {
					socketOptions : {
						socketTimeoutMS : 0,
						connectionTimeout : 0
					}
				}
			}
		},
		Unlock:{
			height: 40000,
			time  : 1500000000
		}
}


//module.exports = MongodbAndUnlockConfig;