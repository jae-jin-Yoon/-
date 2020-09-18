// require는  node.js의 모듈을 요청하기 위한 함수이다. 모듈이랑 노드js의 기능들중 비슷한 기능들을 묶어놓은것
var http = require('http'); //프로토콜 소환      
var fs = require('fs');//fs는 파일시스템으로 파일을 읽어오는 역할을 한다.
var url = require('url')//쿼리스트링을 분석하기 위한 모듈 url을 소환

var app = http.createServer(function(request,response){

   
    var _url = request.url; //request.url 으로 페이지의 요정이 전달된다.(href나 action으로 페이지 이동할때)
    var quertString=url.parse(_url, true).query;//쿼리스트링 분석(parse)하기위한 변수 생성
    var pathname=url.parse(_url,true).pathname;//pathname (쿼리스트링을 재외한 패스)
    
   //pathname이 /일때 실행부
    if(pathname=='/'){
        var description="";
        if(!quertString.id){
            quertString.id="welcome"
        }else{
            description=fs.readFileSync(`./data/${quertString.id}.html`)
        }
            var template =`
        <!doctype html>
            <html>
            <head>
            <title>${quertString.id}의 첫걸음</title>
            <meta charset="utf-8"><br>
           
            </head>
             <body>
            <br><br>
            <h1><a href="/">${quertString.id}</a></h1>
            <ol>
                <li><a href="/?id=html">HTML의시작</a></li>
                <li><a href="/?id=css">css의 시작</a></li>
                <li><a href="/?id=javascript">javascript의 시작</a></li>
            </ol>
    
            <h1>${quertString.id}의 시작</h1>
    
            ${description}
            
            </body>
            </html>
        `
        //받아온 url을 통해 페이지 이동() __dirname은 서버 디랙토리 주소이다(D:\dev65\nodejs\graffiti)
        response.end(template);
        response.writeHead(200);
        //200은 파일을 찾을수있다(통신성공)
        
        //어떠한 if 조건도 만족하지 못한 pathname은 notFound로 표현하자
    }else{
        //writehtead(404)는 파일을찾을수 없을때
        response.writeHead(404);
        response.end('not found')
    }
   

   
    
    // response.end(fs.readFileSync(__dirname+_url)); 파일 시스템을 통해 __dirname+_url의 주소로된 파일을 읽어온다.
    
});

//포드번호 설정 기본 포트는 80번
app.listen(1000);