export function ISO8601_week_no(dt) 
{
     var tdt = new Date(dt.valueOf());
     var dayn = (dt.getDay() + 6) % 7;
     tdt.setDate(tdt.getDate() - dayn + 3);
     var firstThursday = tdt.valueOf();
     tdt.setMonth(0, 1);
     if (tdt.getDay() !== 4) 
       {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
     return 1 + Math.ceil((firstThursday - tdt) / 604800000);
 }

export function formatDate(mode, date){
    var dat = date.getDay();
    var dd = date.getDate();
    var mm = date.getMonth()+1; 
    var yyyy = date.getFullYear();

    
    if(dd<10) {dd='0'+dd;}
    if(mm<10) {mm='0'+mm;}
    if(dat === 0){dat = 'Chủ nhật'}
    else {dat = `Thứ ${dat + 1}`}

    if(mode === 0){
        /* Thu 2, 22/12/2008  */
        return dat + ', ' + dd + '/'+ mm +'/' + yyyy
    }else if (mode === 1){
        // return  'Tuần ' + ISO8601_week_no(date) + ', ' + mm +'/' + yyyy
        return  'Tuần ' + ISO8601_week_no(date) +', ' + yyyy
    }else{
         /* Thang 12, 2008  */
        return  'Tháng '+ mm + ', ' +  yyyy
    }  
     
}
export function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}


export function calNextDay(index,selectedDate) { 
    var nextDay = new Date(getMonday(selectedDate).getTime() + (index* 24 * 60 * 60 * 1000));
    return nextDay
}
export function formatDDMMYYY (date){
    var dd = date.getDate();
    var mm = date.getMonth()+1; 
    var yyyy = date.getFullYear();
    if(dd<10) {dd='0'+dd;}
    if(mm<10) {mm='0'+mm;}
    
    return  dd + '/'+ mm +'/' + yyyy
}
export function getDayText (date){
    switch (date.getDay()){
        case 0: return 'Sun'
        case 1: return 'Mon'
        case 2: return 'Tue'
        case 3: return 'Wed'
        case 4: return 'Thu'
        case 5: return 'Fri'
        case 6: return 'Sat'
    }
        

}
export function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}
// 30 - 44.67   31-44.84  28- 49.64 29-47.94
export function getWidthCss(numberOfDayInMonth){
    if(numberOfDayInMonth == 28){return 55 }
    else if(numberOfDayInMonth == 29){return 53.11 }
    else if(numberOfDayInMonth == 30){return 51.33}
    else{ return 49.67}
}
export function isToday (date){
    const now = new Date();
    console.log(date.toLocaleDateString("en-US"))
    console.log(now.toLocaleDateString("en-US"))
    return date.toLocaleDateString("en-US") === now.toLocaleDateString("en-US")
}