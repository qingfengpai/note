/**
 * 时间需每年更新，大概12月份，国务院办公厅会发布通知
 * 2017年：http://www.gov.cn/zhengce/content/2016-12/01/content_5141603.htm
 */


/**
 * 放假，工作日休息
 */
var holidays = ['2017-1-2', // 元旦补休
    '2017-1-27', '2017-1-30', '2017-2-1', '2017-2-2', // 春节
    '2017-4-3', '2017-4-4', // 清明节
    '2017-5-1', // 劳动节
    '2017-5-29', '2017-5-30', // 端午节
    '2017-10-2','2017-10-3','2017-10-4','2017-10-5','2017-10-6','2017-10-8' // 国庆
];

/**
* 调休，周末上班
*/
var workweekends = ['2017-1-22', '2017-2-4', // 春节
    '2017-4-1', // 清明节
    '2017-5-27', // 端午节
    '2017-9-30'  // 国庆
];


/**
* 
* @param beginDay 字符串，开始时间，例如：'2017-9-24'
* @param workdays 数字，几个工作日，例如：3
* 1 天 86400000 毫秒，1000*60*60*24
* getDay() 方法可返回表示星期的某一天的数字。返回值是 0（周日） 到 6（周六） 之间的一个整数。
* getMonth() 方法可返回表示月份的数字。返回值是 0（一月） 到 11（十二月） 之间的一个整数。
*/
export const computeDay = (beginDay, workdays) => {
    if (!beginDay || beginDay === '') {
        beginDay = new Date();
    }
    /** 总共几个自然日 */
    let index = 1
    /** 工作日是哪几天 */
    let workdaysArray = [];

    /** 兼容ie：IE中的Date构造函数只是不支持"xxxx-xx-xx"这种格式的时间字符串 */
    const dateParts = String(beginDay).split("-");
    const beiginDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1])-1, parseInt(dateParts[2]));
    const today = new Date();

    /** 当天也算一天 */
    --workdays;

    while (workdays > 0) {
        let day = new Date(beiginDate.getTime() + 86400000 * index);
        let dayString = formatDate(day);

        let isWeekend = false;

        if ([0, 6].indexOf(day.getDay()) > -1) {
            isWeekend = true;
        }

        // 看看周末上班不
        if (isWeekend) {
            // 上班
            if (workweekends.indexOf(dayString) > -1) {
                workdays--;
                workdaysArray.push(dayString);
            }
        }
        // 看看工作日放假不
        else {
            // 不放假
            if (holidays.indexOf(dayString) === -1) {
                workdays--;
                workdaysArray.push(dayString);
            }
        }

        index++;

    }

    let lastdayString = workdaysArray[workdaysArray.length - 1];
    let overtime = false;

    // 判断是否超过预定时间
    const dateArray = lastdayString.split('-');
    if (today.getTime() > new Date(parseInt(dateArray[0]), parseInt(dateArray[1])-1, parseInt(dateArray[2])).getTime()) {
        overtime = true;
    }

    const lastday = decodeDate(lastdayString);

    const result = {
        lastdayString: lastdayString,
        overtime: overtime,
        lastday: lastday,
        date: lastday.month + '月' + lastday.day + '日'
    }

    return result;
}

const formatDate = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

const decodeDate = (dateString) => {
    const arr = dateString.split('-');

    return {
        year: arr[0],
        month: arr[1],
        day: arr[2]
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
export const formatDateToString = (date: Date, fmt: string) => {
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
