/** 字幕の経過時間を保持するObjectです。
 * 情報をセットするには {@link TimeWithMillisecond.setTime} を参照してください。
 *  
 * Keep Time information for subtitle.
 * for setting information, see {@link TimeWithMillisecond.setTime}.
 * 
 * @constructor
 * @this {TimeWithMillisecond}
 * @param {number} hour - Hour. 0<= hour
 * @param {number} minute - Minute. 0 <= minute < 60
 * @param {number} second - second. 0 <= second < 60
 * @param {numnrt} millisecond - millisecond. 0 <= millisecond < 1000
 */


function TimeWithMillisecond(hour =0, minute=0, second=0, millisecond=0){
    // console.log("x:"+hour+":"+minute+":"+second+"."+millisecond);
    //value
    this.hour;
    this.minute;
    this.second;
    this.millisecond;
    this.invalid;

    
    /** get integer safely. if it have not a numbers, then remove, and only read ASCII number text.
     * 
     * @param {*} input 
     * @returns {number} 
     */
    this.getSafeInt = function (input){
        output = 0;
        if(typeof(input) != "number"){
            output = Number.parseInt(input);
            if (Number.isNaN(output)){
                this.invalid = true;
                output = 0;
            }else{
                
            }

        } else if (Number.isSafeInteger(input)){
            output = input;
        } else {
            this.invalid = true;
            output = 0;
        }
        return output;
    }

    /** 経過時間を設定する命令です。内部的に [getSafeInt]{@link TimeWithMillisecond.getSafeInt} を呼び出し、
     * 有効な数字以外を排除します。ASCII数字以外が入力された場合、該当の欄が
     * 0 となり、this.invalid が true になります。
     * 
     * @param {number} hour 
     * @param {number} minute 
     * @param {number} second 
     * @param {number} millisecond 
     * 
     */
    this.setTime = function( hour, minute, second, millisecond){
        this.invalid = false;
        // If input has invalid value(e.g. "KKDE", NaN), this.invalid flag was true by this.getSafeInt().
        this.hour = this.getSafeInt(hour);    
        this.minute = this.getSafeInt(minute);
        this.second = this.getSafeInt(second);
        this.millisecond = this.getSafeInt(millisecond);
    }
    // Object constructor code.
    this.setTime(hour,minute,second,millisecond);

    /**
     * 自身が保持している時間情報をSbv 形式で返します。
     * @returns {string} Sbv形式で表記された時間 Time, written in SBV style.
     */
    this.getTimeAsSbv = function(){
        timeText = "";
        timeText += this.hour + ":" ;
        if (0 <= this.minute && this.minute <= 9){
            timeText += "0";
        }
        timeText += this.minute + ":" ;

        if (0 <= this.second && this.second <= 9){
            timeText += "0" ;
        }
        timeText += this.second + "." ;

        if (0 <= this.millisecond && this.millisecond <=9){
            timeText += "00" + this.millisecond;
        }else if(10<= this.millisecond && this.millisecond <=99){
            timeText += "0" + this.millisecond;
        }else{
            timeText += this.millisecond;
        }
        return timeText;
    }
    
    /**
     * 自身が保持している時間情報をSRT 形式で返します。
     * @returns {string} SRT形式で表記された時間 Time, written in SRT style.
     */
    this.getTimeAsSrt = function(){
        timeText = "";
        if ( 0 <= this.hour && this.hour <= 9){
            timeText += "0";
        }
        timeText += this.hour + ":" ;

        if (0 <= this.minute && this.minute <= 9){
            timeText += "0";
        }
        timeText += this.minute + ":" ;

        if (0 <= this.second && this.second <= 9){
            timeText += "0" ;
        }
        timeText += this.second + "," ;

        if (0 <= this.millisecond && this.millisecond <=9){
            timeText += "00" + this.millisecond;
        }else if(10<= this.millisecond && this.millisecond <=99){
            timeText += "0" + this.millisecond;
        }else{
            timeText += this.millisecond;
        }
        return timeText;
    }

    /**
     * 自身が保持している時間情報を秒数で返します。
     * @returns {number} 時間（秒）。整数で、ミリ秒は切り捨てます。
     */
    this.getTimeSec = function(){
        retrun ((this.hour * 60) + this.minute) * 60 + this.second;
    }

    this.getTimeSecFloat = function(){
        return ((this.hour * 60) + this.minute) * 60 + this.second + (this.millisecond / 1000);
    }
    this.getTimeMillisec = function(){
        return ( ( (this.hour * 60) + this.minute) * 60 + this.second )*1000  + this.millisecond;
    
    }
}


