module.exports = {
    runMetrics : (json) => {

        var startCountDate = new Date(json.minDate);
        var startShowingDate = new Date(json.minShowDate);
        var endCountDate = new Date(json.maxDate);
        
        var objList = [];

        const millPerDay = 1000 * 60 * 60 * 24;

        //function for adding days to a date object
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }

        //get number of days between 2 dates
        function getDateDiff(startDate, stopDate){
            var timeDiff = stopDate.getTime() - startDate.getTime();
            var dayDiff = timeDiff / millPerDay;
            return dayDiff;
        }

        //get list of dates between 2 dates
        function getDates(startDate, stopDate) {
            var dateArray = new Array();
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                dateArray.push((new Date (currentDate)).toISOString());
                currentDate = currentDate.addDays(1);
            }
            return dateArray;
        }

        //filter out of count range data
        var inRangeData = json.records.filter(o => (new Date(o[2])) >= startCountDate);
        
        //clean data
        for (var val of inRangeData){
            var openDate = (val[2].slice(0,10));
            var closeDate = "";
            var woNum = val[0].split('#')[1];
            if (val[1] == "Closed"){
                if (val[3] != undefined){
                    closeDate = (val[3].slice(0,10));
                } else {
                    closeDate = openDate;
                }
            }
            if (closeDate != ""){
                obj = {'woNum': woNum, 'openDate': new Date(openDate), 'closeDate': new Date(closeDate)};
            } else {
                obj = {'woNum': woNum, 'openDate': new Date(openDate), 'closeDate': ""};
            }
            objList.push(obj);
        }

        //gather statistics
        var dateList = getDates(startCountDate, endCountDate);
        var returnDataList = [];
        //initialize return object
        for (var val of dateList){
            returnDataList.push({date: val, openedCount: 0, closedCount: 0, currentlyOpenCount: 0, closedList: [] });
        }

        //calculate useful stats
        var runningTotal = 0;
        for (var i in returnDataList){
            var opened = objList.filter(o => o.openDate.toISOString().slice(0,10) == returnDataList[i].date.slice(0,10));
            var closed = objList.filter(function(c) {if (c.closeDate != "") { return c.closeDate.toISOString().slice(0,10) == returnDataList[i].date.slice(0,10); } else{return 0;}});
            returnDataList[i].openedCount = opened.length;
            returnDataList[i].closedCount = closed.length;
            returnDataList[i].closedList = closed.map(m => m.woNum);

            //Running total WO independent
            runningTotal += opened.length - closed.length;
            returnDataList[i].currentlyOpenCount = runningTotal;

        }
        //Filter and return the useful data based on user parameters
        var showData = returnDataList.filter(o => (new Date(o.date)) >= startShowingDate);
        return showData;
    }
}