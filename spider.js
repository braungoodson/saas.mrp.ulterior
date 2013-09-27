/*

        .__        ___.          .__   
   ____ |  |   ____\_ |__ _____  |  |  
  / ___\|  |  /  _ \| __ \\__  \ |  |  
 / /_/  >  |_(  <_> ) \_\ \/ __ \|  |__
 \___  /|____/\____/|___  (____  /____/
/_____/                 \/     \/      

ASCII by http://www.network-science.de/ascii/

*/
//
var fs = require('fs');
//
var color = require('cli-color');
// Mock Database
var registry = {registrants:[
	{name:'braungoodson@spider.web',password:'braungoodson',token:null}
]};
var data = {
    statistics: {
        hits:0
    }
};
//
function Route(filePath) {
	this.relativeFilePath = filePath;
	this.route = filePath.substr(1,filePath.length-1);
	var type = filePath.substr(filePath.lastIndexOf('.')+1,filePath.length-1);
	if (type == "js") {
		type = "javascript";
	}
	this.contentType = 'text/'+type;
}
Route.prototype.log = function () {

	console.log(color.magenta('spider')+':'+color.green(this.relativeFilePath)+':'+this.route+':'+this.contentType);
	return this;
}
/*
  ______ ______________  __ ___________ 
 /  ___// __ \_  __ \  \/ // __ \_  __ \
 \___ \\  ___/|  | \/\   /\  ___/|  | \/
/____  >\___  >__|    \_/  \___  >__|   
     \/     \/                 \/       
*/
// Server to handle all cloud requests.
var server = require('express.io')();
server.http().io();
server.listen(10000);
/*
                         __   
_______   ____   _______/  |_ 
\_  __ \_/ __ \ /  ___/\   __\
 |  | \/\  ___/ \___ \  |  |  
 |__|    \___  >____  > |__|  
             \/     \/    
 */
//
var routes = [
	new Route('./views/indexTemplate.html').log(),
	new Route('./views/echoTemplate.html').log(),
	new Route('./views/registerTemplate.html').log(),
	new Route('./views/loginTemplate.html').log(),
	new Route('./views/loggedinTemplate.html').log(),
	new Route('./views/logoutTemplate.html').log(),
	new Route('./spiderWeb.js').log(),
	new Route('./favicon1.png').log(),
	new Route('./bootstrap/css/bootstrap-responsive.css').log(),
	new Route('./bootstrap/css/bootstrap-responsive.min.css').log(),
	new Route('./bootstrap/css/bootstrap.css').log(),
	new Route('./bootstrap/css/bootstrap.min.css').log(),
	new Route('./bootstrap/img/glyphicons-halflings-white.png').log(),
	new Route('./bootstrap/img/glyphicons-halflings.png').log(),
	new Route('./bootstrap/js/bootstrap.js').log(),
	new Route('./bootstrap/js/bootstrap.min.js').log()
];
//
console.log(color.magenta('spider')+':'+color.red('definingroutes'));
for (var i = 0; i < routes.length; ++i) {
	server.get(routes[i].route,(function (contentType,relativeFilePath) {
				return function (q,r) {
					console.log(color.magenta('spider')+':'+color.cyanBright(q.path));
					r.setHeader('Content-Type',contentType);
					fs.readFile(relativeFilePath,function(e,data){if(e){console.log(color.red('spider')+':'+color.red(q.path+':'+e));}else{r.send(data);}})
				}
			}(routes[i].contentType,routes[i].relativeFilePath)
		)
	);
	console.log(color.magenta('spider')+':'+color.yellow('routedefined:')+routes[i].route);
}
//
server.get('/',function(q,r){
	console.log(color.magenta('spider')+':'+color.cyanBright(q.path));
	console.log(color.magenta('spider')+':forward:'+color.magenta('./views/rootTemplate.html'));
	r.setHeader('Content-Type','text/html');
	fs.readFile('./views/rootTemplate.html',function(e,data){
		if (e) {
			console.log(color.red('spider')+':'+color.red(q.path+':'+e));
		} else {
			r.send(data);
		}
	});
});
//
server.get('/echo',function(q,r){
	console.log('echo');
	r.setHeader('Content-Type','text/plain');
	r.send('echo');
});
console.log(color.magenta('spider')+':'+color.green('routesdefined'));
/*
                     __           __   
  __________   ____ |  | __ _____/  |_ 
 /  ___/  _ \_/ ___\|  |/ // __ \   __\
 \___ (  <_> )  \___|    <\  ___/|  |  
/____  >____/ \___  >__|_ \\___  >__|  
     \/           \/     \/    \/      

*/

//
server.io.route('echo',function(q){
    console.log(color.magenta('spider')+':'+color.yellowBright('echo'));
	q.io.emit('echo','echo');
});
server.io.route('broadcast',function(q){
    console.log(color.magenta('spider')+':'+color.magentaBright('broadcast'));
    server.io.broadcast('broadcast','broadcast');
});
server.io.route('hit:create',function(q){
    console.log(color.magenta('spider')+':'+color.magentaBright('hit:create'));
    data.statistics.hits++;
    server.io.broadcast('hit:update',data);
});
server.io.route('login',function(q){
	console.log(color.magenta('spider')+':'+color.red('login:')+q.data.user.name);
	if (q.data.user.name && q.data.user.password) {
		for (var r = 0; r < registry.registrants.length; ++r) {
			if ((registry.registrants[r].name == q.data.user.name) && (registry.registrants[r].password == q.data.user.password)) {
				var token = new Buffer(new Date().toString()).toString('base64');
				registry.registrants[r].token = token;
				console.log(color.magenta('spider')+':'+token);
				return q.io.emit('loggedin',token); // provide token here
			}
		}
		return q.io.emit('incorrectlogin','incorrectlogin');
	} else {
		return q.io.emit('notloggedin','notloggedin');
	}
});
server.io.route('register',function(q){
	console.log(color.magenta('spider')+':'+color.greenBright('register')+':'+q.data.user.name+':'+q.data.user.password);
	if (q.data.user.name && q.data.user.password) {
		registry.registrants.push({name:q.data.user.name,password:q.data.user.password,token:null});
		q.io.emit('registered','registered');
	} else {
		q.io.emit('notregistered','notregistered');
	}
});
/*server.io.route('users:read',function(q){
	console.log(color.magenta('spider')+':'+'users:read');
	server.io.broadcast('users:update',{users:{registry.registrants}});
});*/
server.io.route('user:read:name',function(q){
	console.log(color.magenta('spider')+':'+color.red('token')+':'+q.data);
	if (q.data) {
		for (var r = 0; r < registry.registrants.length; ++r) {
			if (registry.registrants[r].token == q.data) {
				return q.io.emit('user:update:name',{user:{name:registry.registrants[r].name}});
			}
		}
		return q.io.emit('user:read:tokenerror','user:read:tokenerror');
	} else {
		return q.io.emit('user:read:notoken','notloggedin:notoken');
	}
});
/*
//
server.io.route('login',function(q){
	if (q.data.login.name && q.data.login.name) {
		for (var r = 0; r < registry.registrants.length; ++r) {
			if ((registry.registrants[r].name == q.data.login.name) && (registry.registrants[r].password == q.data.login.password)) {
				return q.io.emit('registrants/read'); // provide token here
			}
		}
		return q.io.emit('incorrectlogin','incorrectlogin');
	} else {
		return q.io.emit('notloggedin','notloggedin');
	}
});
//
server.io.route('registrants/create',function(q){
	if (q.data.registrant.name && q.data.registrant.password) {
		console.log('registrants/create:'+registry.registrants.length);
		registry.registrants.push(q.data.registrant);
		q.io.broadcast('registrants/update',{registrants:registry.registrants});
	} else {
		q.io.emit('unregistered','unregistered');
	}
});
//
server.io.route('registrants/read',function(q){
	console.log('registrants/read');
	q.io.emit('registrants/update',{registrants:registry.registrants});
});
*/




