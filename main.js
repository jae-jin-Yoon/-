const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');//post를 분석하는 모듈

 //템플릿
function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
    
  </body>
  </html>
  `;
}
//파일리스트
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}
 //서버 가 도는 로직
var app = http.createServer(function(request,response){
    var _url = request.url;//url가져오는 모듈
    var queryData = url.parse(_url, true).query;//가져온 url을 parse하여 스트링 쿼리를 가져온다.
    var pathname = url.parse(_url, true).pathname;//가저온 url을 parse하여 pathname을 가져온다.

    if(pathname === '/'){//패스가 /일 경우
      if(queryData.id === undefined){
        
        fs.readdir('./data', function(error, filelist){//파일리스트를 만들어서 보내줌 ./data 폴더안에 있는 리스트를 가져옴=>배열로 반환
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);//파일리스트를 함수안에 넣어서 반복문이 실행되고 그결과를 return함
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a><br>`);//
          response.writeHead(200);
          response.end(template);
        })

      } else {

        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
            ` 
              <a href="/create">create</a><br>
              <a href="/update?id=${title}">update</a><br>
              <form action="/process_delete" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>
            `);
            //delete는 form에서 post형식으로 보내야한다.(아무나 지울수없도록)
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if( pathname=='/create'){

        fs.readdir('./data', function(error, filelist){//파일리스트를 만들어서 보내줌 ./data 폴더안에 있는 리스트를 가져옴=>배열로 반환
            
            var title = "WEB-CREATE";
            var list = templateList(filelist);//파일리스트를 함수안에 넣어서 반복문이 실행되고 그결과를 return함
            
            fs.readFile('./forms/createform.html','utf8',function(err,data){
                var template = templateHTML(title, list,data,'')
                response.writeHead(200);
                response.end(template);
            })
        })
        
    }else if(pathname=="/process_create"){
        var body='';
        //post데이터를 받는법(get방식이아닌 post방식)
        request.on('data',function(data){//포스트방식의 데이터를 받는법 데이터를 계쏙 받아 body 변수에 쌓는다.
            body=+body+data;
        });

        request.on('end',function(){//그렇게 데이터를 쌓다가 더이상 데이터가 없으면 end 콜백함수를 '자동'으로 실행한다.
            var post =qs.parse(body)//post정보를 객체화(json) 할 수 있다.
            var title=post.title
            var description=post.description
            fs.writeFile(`data/${title}.html`,description,'utf8',function(err){
                //err가 있을경우엔 err을 처리해주주자
              console.log(post)
              response.writeHead(302,{location:`/?id=${title}`})
              //302는 패이지를 다른곳으로 이동시키라는 뜻
              response.end()
              
            })
        });
        
    }else if(pathname==='/update'){
      fs.readdir('./data', function(error, filelist){
        
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,`
            <form  action="/process_update" method="POST">   
              <input type="hidden" name="ddd">
              <p><input type="hidden" value="${title}" name="id"></p>
              <p><input type="text" name="title" value="${title}" placeholder="title"></p>
              <p><textarea name="description"  placeholder="description">${description}</textarea></p>
              <p><input type="submit" value="전송"></p>
            </form>`);
          
          response.writeHead(200);
          response.end(template);
        });
      });
    }else if (pathname==='/process_update'){
      
      
        var body="";
        request.on('data',function(data){
          
          body=body+data
        })

        request.on('end',function(){
          var post=qs.parse(body)
          var id = post.id
          var title= post.title
          var description=post.description
          fs.rename(`data/${id}`,`data/${title}`,function(error){//일단 파일명을 바꾸고 그파일명의 내용을 변환
            fs.writeFile(`data/${title}`,description,'utf8',function(){
              response.writeHead(302,{Location:`/?id=${title}`});
              response.end()
            })
          })
          console.log(post)
        })


    }else if (pathname==='/process_delete'){
      
      
      var body="";
      request.on('data',function(data){
        
        body=body+data
      });

      request.on('end',function(){
        var post=qs.parse(body)
        var id = post.id
        fs.unlink(`./data/${id}`,function(error){//삭제를 실행하는 매소드(unlink)
          response.writeHead(302,{Location:`/`})
          response.end();
        })
        
        
      })


  } else  {
     
      response.writeHead(404);
      response.end('Not found');
    }
 
 
 
});
app.listen(3000);