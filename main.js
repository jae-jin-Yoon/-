 // require는  node.js의 모듈을 요청하기 위한 함수이다. 모듈이랑 노드js의 기능들중 비슷한 기능들을 묶어놓은것
 //프로토콜 소환      
var http = require('http');
var fs = require('fs');

//쿼리스트링을 분석하기 위한 모듈 url을 소환
var url = require('url')

var app = http.createServer(function(request,response){

    //request.url 으로 페이지의 요정이 전달된다.(href나 action같은)
    var _url = request.url;
    
    //쿼리스트링 분석하기위한 변수 생성
    var quertString=url.parse(_url, true).query;
    
    //쿼리스트링의 키값(id)을 표현한다.
    console.log(quertString.id)

    if(_url=='/'){
        _url='/index.html';
    }
    if(_url=='/favicon.ico'){
        return response.writeHead(404);
    }
    response.writeHead(200);

    //받아온 url을 통해 페이지 이동()
    response.end(fs.readFileSync(__dirname+_url));
});

//포드번호 설정 기본 포트는 80번
app.listen(3000);