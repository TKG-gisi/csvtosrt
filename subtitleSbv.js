// このファイルには、「timeWithMillisecond.js」を必要とします。

/*
    str.match(
        new RegExp("([0-9]+):([0-9]+):([0-9]+).([0-9]+)")
    )

    いきなり時間を読み取るRegExp Match.
    読み取り方は… https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec

*/


/**
 * @file readSBV - this is readSBV file 
 */


/**
 * individual subtitle information set.
 * @typedef subtitleData
 * @type {object}
 * @property {TimeWithMillisecond} start - a subtitle line start time information.
 * @property {TimeWithMillisecond} end - a subtitle line end time information.
 * @property {string} subtitle - subtitle text.
 * 
 */


// Example
// inputString = "0:00:00.000,0:00:09.876\nTest\n\n\n0:00:10.111,0:00:11.111\nTest2\n\n";

/** readSbv reads SBV sibtitle text, and returns data array.
 * 
 * @param {string} inputString - input string, it's SBV subtitle text.
 * @returns {array<subtitleData>} - 
 */
function inputSbv(inputString){
    
    subDatas = inputString.replaceAll("\r\n","\n").replaceAll("\r","\n").split("\n\n");

    data = []; subIndex = 0;
    // for(i=0; i <subDatas.length; i++){console.log(subDatas[i])}
    for(i = 0; i < subDatas.length; i++){
        subBuffer = subDatas[i].trim();
        subOneData = [];

        if (subBuffer != ""){
            startTime = subBuffer.match(new RegExp("([0-9]+):([0-9]+):([0-9]+).([0-9]+)"));
            if( startTime.length == 5){
                subBuffer = subBuffer.substr(startTime[0].length);
                subOneData['start'] = new TimeWithMillisecond(startTime[1], startTime[2], startTime[3], startTime[4]);
            } else{
                // failed to get start time.
            }

            subBuffer = subBuffer.trim().substr(1).trim(); //eat space and comma.

            endTime   = subBuffer.match(new RegExp("([0-9]+):([0-9]+):([0-9]+).([0-9]+)"));
            if (endTime.length == 5){
                subBuffer = subBuffer.substr(endTime[0].length + 1);
                subOneData['end']   = new TimeWithMillisecond(endTime[1], endTime[2], endTime[3], endTime[4]);
            } else {
                // failed to get end time.
            }

            if (subBuffer.substr(0,1) == "\n") subBuffer = subBuffer.substr(1);

            subOneData['subtitle'] = subBuffer;

            data[subIndex] = subOneData;
            subIndex += 1;
        } else if( i == (subDatas.length -1) ){
            // is last subDatas?
            break;
        } else{
        }
    }
    return data;
}


function outputSbv(subtitleData,returntype){
    sbvtext = "";
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

    for (let index = 0; index < subtitleData.length; index++) {
        sbvtext += subtitleData[index]['start'].getTimeAsSbv() + ",";
        sbvtext += subtitleData[index]['end'].getTimeAsSbv() + returnCode;
        sbvtext += subtitleData[index]['subtitle'] + returnCode + returnCode;
    }
    return sbvtext;
}
