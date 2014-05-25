var express = require('express');
var app = express();
var pages = [];
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(express.json());     

app.configure(function() {
	app.use(express.static(__dirname)); 		
});

app.get('/api/pages', function(req, res) {
    if(!req.session.allpages){
    	req.session.allpages = [];
res.json(req.session.allpages);
    }else{
	
	res.json(req.session.allpages); }
});

app.post('/api/pages', function(req, res) {


	var value = "P" + updateCount(req);

	req.session.allpages.push({text:req.body.text, value:value });
	
	res.json(req.session.allpages);
		


	});

app.get('/api/queryhistory', function(req, res) {
    if(!req.session.allquery){
    	req.session.allquery = [];
res.json(req.session.allquery);
    }else{
	
	res.json(req.session.allquery); }
});

app.post('/api/queryhistory', function(req, res) {
	// var value = "P" + updateCount();
	if(req.session.allquery){
    if(req.session.allquery.length > 9)
    {
var oldhistory = req.session.allquery;
req.session.allquery = [];

req.session.allquery =  deleteHistory(oldhistory,req);
    }
}

    var value = "Q" + updateQueryCount(req);
	req.session.allquery.push({text:req.body.text, value:value });
	
	res.json(req.session.allquery);
		


	});


	



app.delete('/api/pages/:id', function(req, res) {
	
	var oldpages = req.session.allpages;
 req.session.allpages = [];
req.session.count = 0;
 oldpages.forEach(function(page) {
    // console.log(page);
    if(req.params.id != page.value)
    {
     var value = 'P' + updateCount(req);
     req.session.allpages.push({text:page.text, value: value });



 }
});
 res.json(req.session.allpages);
});

function updateCount(req){
	if(!req.session.count)
	{

	req.session.count = 0;	
	}
req.session.count = req.session.count + 1;
return req.session.count;
}

function updateQueryCount(req){
	if(!req.session.qrycount)
	{
	req.session.qrycount = 0;	
	}
req.session.qrycount = req.session.qrycount +1 ;
return req.session.qrycount;


}

function deleteHistory(allquery,req){
allquery.splice(0, 1);
	var oldhistory = allquery;
 allquery = [];
req.session.qrycount = 0;
 oldhistory.forEach(function(history) {
    // console.log(page);

     var value = 'Q' + updateQueryCount(req);
            allquery.push({text:history.text, value: value });

});
return allquery;

}

            
               
                


app.listen(process.env.PORT || 7000);
console.log("app listenning on port 7000")