/* subtools.js */
/* require: ReadSBV.js, with  timeWithMillisecond.js */

/**
 * array of {'start':<timeWithMillisecond>, 'end':<timeWithMillisecond>, 'data':string}
 */
subtitleDataSet = [];

/* subtools file loader  start */

function fileImport(){
    userFileType = document.getElementsByName("inputFileType")[0].value;
    dataHaveEnd = document.getElementsByName("haveEnd");
    inputFile = document.getElementById("inputFile").files[0];

    const reader = new FileReader();
    filedata = "";
    reader.onload = function (event){
        filedata = event.target.result;
    }
    reader.onloadend = function (event){
        switch(userFileType){
        case "csv":
            //console.log(filedata);
            subtitleDataSet = inputCsv(filedata);
            break;
        case "sbv":
            // BOM付には対応していません
            subtitleDataSet = inputSbv( filedata );
            break;
        }
        let list = "<table border='1'>";
        for (let index = 0; index < subtitleDataSet.length; index++) {
            list += "<tr>";
            list += "<td>" + subtitleDataSet[index]["start"].getTimeAsSbv();
            list += "</td><td>" + subtitleDataSet[index]["end"].getTimeAsSbv();
            if(typeof subtitleDataSet[index]["subtitle"] === "undefined"){
                list += "</td><td>";
            }else{
                list += "</td><td>" + subtitleDataSet[index]["subtitle"].replaceAll("\n","<br>");
            }
            
            list += "</td></tr>";
        }
        list += "</table>";
        document.getElementById("subtitleList").innerHTML = list;
        console.log("Loaded data length:" + subtitleDataSet.length);
    }
    reader.readAsText(inputFile);
}
/* subtools file loader end */

/* subtools file exporter start */
function fileExport(){
    /* subtools file exporter part 1: dataset to text converter*/

    fileType = document.getElementsByName("outputFileType")[0].value;
    outputCharCode = document.getElementsByName("outputFileCharCode")[0].value;

    var text,mime,ext;
    lineEnd = document.getElementsByName("returnCode")[0].value;
    switch (fileType){
        case "csv":
        default:
        text = outputCsv(subtitleDataSet, lineEnd);
        mime = "text/csv";
        ext = "csv";
        break;
        case "srt":
        text = "Sorry, not made yet.";
        mime = "text/plain";
        ext = "txt"
        break;
        case "sbv":
        text = outputSbv(subtitleDataSet, lineEnd);
        mime = "text/plain";
        ext = "sbv";
        break;
    }
    /* subtools file exporter part 2: text to download process */
    if (outputCharCode == "utf-8_NoBOM"){
        blob = new Blob([text], {"type":mime});
    } else {
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        blob = new Blob([bom, text], {"type":mime});
    }

    if (window.navigator.msSaveBlob){
        // for microsoft Internet Explorer
        
        window.navigator.msSaveBlob(blob, "subtitle."+ext); 

        // msSaveOrOpenBlob :  choose [file saving] or [just open].
        // window.navigator.msSaveOrOpenBlob(blob, "test.csv"); 
    } else {
        document.getElementById("download").href = window.URL.createObjectURL(blob);
        document.getElementById("download").setAttribute("download","subtitle."+ext);  
    }
}

/* subtools file exporter end */
