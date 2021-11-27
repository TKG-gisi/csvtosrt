/*
    inputCsv()
    outputCsv() is core.
*/

// string -> TOKEN, string
// string -> TOKEN, string without first TOKEN
function getToken(csvText){
    let s = csvText.substr(0,1);
    let after = csvText.substr(1);
    switch (s){
        case "\r":
            if( after.substr(0,1) == "\n"){
                // state: LINE_DELIMITER2
                return {"token":{"type":"LINE_DELIMITER","text":""}, "after":after.substr(1)};
            }else{
                // state: LINE_DELIMITER
                return {"token":{"type":"LINE_DELIMITER","text":""}, "after":after};
            }
            break;
        case "\n":
            // state: LINE_DELIMITER2
            return {"token":{"type":"LINE_DELIMITER","text":""},"after":after};
            break;
        case ",":
            // CELL_DELIMITER
            return {"token":{"type":"CELL", "text":""}, "after":after};
            break;
        case "":
            // EOF
            return {"token":{"type":"EOF", "text":""}, "after":""};
            break;
        case "\"":
            a = getCsvStringTokenWithQuote(after, "");
            return {"token":{"type":"CELL", "text":a.token}, "after":a.after};
            break;
        default:
            a = getCsvStringToken(s+after, "");
            return {"token":{"type":"CELL", "text":a.token}, "after":a.after};
    }
     
    // return {"token":{"type":type, "text":text},"after":after};
}

// return {"token":token text, "after": after token string}
function getCsvStringTokenWithQuote( string, tok ){
    let s = string.substr(0, 1);
    let after = string.substr(1);
    // console.log("token:" + tok  + ", after:" + after  + ", s="+s);
    switch(s){
        case '"':
            switch(after.substr(0,1)){
                case '"':
                    return getCsvStringTokenWithQuote(after.substr(1), tok + '"');
                    break;
                case ',': 
                    // "_abcdefg\",_hijklmn" -> "_abcdefg" | "_hijklmn"
                    return {"token":tok, "after":after.substr(1)};
                case '':   // "_abcdefg\""-> "_abcdefg"| ''
                case "\n": // "_abcdefg\"\n -> "_abcdefg" | "\n"
                case "\r": // "_abcdefg\"\r -> "_abcdefg" | "\r"
                    return {"token":tok, "after":after};
                    break;
                default:
                    // token like "abcdefg"hijklmn -> "abcdefg" is valid cell.
                    // but hijklmn is ...what?
                    // Should I throw new Error(Invalid token error)?
                    return getCsvStringTokenWithQuote(after, tok+s);
                    break;
            }
            break;
        case '':
            // string end
            // token like '"abcdefg' 
            // -> token start from '"', and token text:'abcdefg', but suddenly [EOF].
            // ... I shuld throw new Error(TokenNotClosed)?
                return {"token":tok, "after":after};
            break;
        default:
            return getCsvStringTokenWithQuote(after, tok+s);
            break;
    }
}

//return {"token":token text, "after": after token string}
function getCsvStringToken(string, tok){
    let s = string.substr(0,1);
    let after = string.substr(1);
    switch(s){
        case ',':
            return {"token":tok, "after":after};
            break;
        case "\r":
        case "\n":
        case "":
            return {"token":tok, "after":s+after};
            break;
        default:
            return getCsvStringToken(after, tok+s);
    }
}
function readCsv(csvText){
    let result = [];
    let lineptr=0;
    let cellptr=0;
    result[lineptr] = [];
    let cell = "";
    let after = csvText;
    let pair,token;

    while(true){
        pair = getToken(after);
        token = pair.token;
        after = pair.after;
        if (token.type == "EOF"){
            break;
        }else if (token.type == "LINE_DELIMITER"){
            lineptr++;
            result[lineptr] = [];    
            cellptr = 0;
        } else {
            // token.type == CELL
            result[lineptr][cellptr] = token.text;
            cellptr++;
        }    
    }
    return result;
} // return data array from csv text
function convertTime(time){
    let hour,minute,second,millisecond;
    const fullTimeType = new RegExp("([0-9]+):([0-9]+):([0-9]+).([0-9]+)")
    const timetype1 = new RegExp("([0-9]+):([0-9]+):([0-9]+)");
    const timetype2 = new RegExp("([0-9]+):([0-9]+)");
    if(fullTimeType.test(time)){
        let a = time.match(fullTimeType);
        hour = a[1];
        minute = a[2];
        second = a[3];
        millisecond = a[4];
    }else if(timetype1.test(time)){
        let a = time.match(fullTimeType);
        hour = a[1];
        minute = a[2];
        second = a[3];
        millisecond = 0;
    }else if(timetype2.test(time)){
        let a = time.match(timetype2);
        hour = 0;
        minute = a[1];
        second = a[2];
        millisecond = 0;
    }
    //有効数字の処理
    if (millisecond.length == 1){
    	millisecond = millisecond*100;
    } else if(millisecond.length == 2){
    	millisecond = millisecond*10;
    }
    
    
    return new TimeWithMillisecond(hour,minute,second,millisecond);
}
function inputCsv(text){
    let table = readCsv(text);
    // console.log(data);
    let subtitleData = [];
    console.log(document.getElementsByName("haveEnd")[0].value);
    if(document.getElementsByName("haveEnd")[0].value != "true"){
        for (let index = 0; index < table.length; index++) {
            subtitleData[index] = [];
            // startTime
            subtitleData[index]["start"] = convertTime(table[index][0]);
            // endTime
            subtitleData[index]["end"] = convertTime(table[index][0]);
            subtitleData[index]["end"].millisecond = 900;
            // text
            subtitleData[index]["subtitle"] = table[index][1];
        }
    }else{
        for (let index = 0; index < table.length; index++) {
            subtitleData[index] = [];
            // startTime
            subtitleData[index]["start"] = convertTime(table[index][0]);
            // endTime
            subtitleData[index]["end"] = convertTime(table[index][1]);
            // text
            subtitleData[index]["subtitle"] = table[index][2];
        }
    }
    // console.log("inputCsv:");console.log(subtitleData);
    return subtitleData;
}


/* */
function outputCsv(data, returntype){
    switch(returntype){
        case "r":
            returnCode = "\r";
            break;
        case "n":
            returnCode = "\n";
            break;
        case "rn":
        default:
            returnCode = "\r\n";
            break
    }
    //  var lines=[];
    csv = "";
    for(i=0; i < data.length; i++){
        line = csvCell(data[i].start.getTimeAsSbv()) +",";
        line += csvCell(data[i].end.getTimeAsSbv())+",";
        line += csvCell(data[i].subtitle) + returnCode;
        //  lines[i] = line;
        csv += line;
    }
    return csv;
}

function csvCell(text = ""){
    if(text.includes("\"")){
        text = text.replaceAll("\"","\"\"");
    }
    if( text.includes('""') || text.includes("\n") || text.includes("\r") || text.includes(",")){
        return '"'+ text + '"';
    }else{
        return text;
    }
}
