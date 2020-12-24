// Imports
const http = require('http')
var fs = require('fs');
var url = require('url');

/* Register server: */
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var q = url.parse(req.url, true);
    var path = q.pathname;
    console.log("Serving " + req.url);
    res.write(req.url);

    if(path == "/") {
    	mainPage(res);
    }
    else if (path == "/main.css") {
        loadmaincss(res);
    }
    else if (path == "/append") {
        appendData(res, q.query);
    }
    else if (path == "/character") {
        charPage(res);
    }
    res.end();

    function mainPage(res) {
        let mainHTML = fs.readFileSync('index.html', 'utf8');
        res.write(mainHTML);
        res.end();
    
    }

    function loadmaincss(res) {
        let mainCSS = fs.readFileSync('main.css', 'utf8');
        res.write(mainCSS);
        res.end();
    }

    function appendData(res, query) {
        let header = fs.readFileSync('appendDataList.html', 'utf8');
        var charname = query.charname;
        var nameclass = query.nameclass;
        
        res.write("<table>")
        res.write("<p>\Your character name is "+charname+" and your class is "+ nameclass+".\</p>")
        res.write("</table>")
        fs.appendFileSync('charlist.lis',charname+" "+nameclass+",\n")
        res.write(header);
        res.end();
    }

    function charPage(res) {
        let header = fs.readFileSync('printlist.html', 'utf8');

        let data = fs.readFileSync('charlist.lis', 'utf8');
        data = data.slice(0, -2);
        lines = data.toString().split(",");
    
        if (lines == "" || lines == null){
            let newform = fs.readFileSync('newcharform.html', 'utf8');
            res.write(newform);
        }
        else  {
            res.write("<table>")
            res.write("<tr><th>Character Name</th><th>Character Class</th></tr>")
            for (let i = 0; i < lines.length; i++) {
                let word = lines[i].split(" ");
                res.write("<td>"+word[0]+"</td>");
                res.write("<td>"+word[1]+"</td>");
                res.write("</tr>");
                console.log(word[0], word[1])
            };
            res.write("</table>")
            res.write(header);
        };
        res.write(header);
        res.end();
    }



    
}).listen(8080);

