import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtCalendar } from "taro-ui"

import "taro-ui/dist/style/components/calendar.scss"; //按需引入
import './index.scss'

export default class Index extends Component {

  // marks={ [ { value: '2018/11/11' } ] } 
  state = { min_date: '', selectdate: '', marks: [], markMap: [] }

  componentWillMount() {

  }

  componentDidMount() {
    // 获取今天的时间年月日
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    // 将今天的时间转化为时间戳
    let now_timestamp = new Date(year, month, day).getTime()
    // 一天的时间戳
    let timestamp = 24 * 60 * 60 * 1000;
    // 获取明天时间戳
    let next_timestamp = now_timestamp + timestamp
    // 获取明天的年月日拼接
    let next_date = new Date(next_timestamp)
    let next_year = next_date.getFullYear()
    let next_month = next_date.getMonth()
    let next_day = next_date.getDate()
    let mindate = `${next_year}/${next_month}/${next_day}`
    let mindatetext = `${next_year}年${next_month}月${next_day}日`
    // 获取当前月份有几天
    let days = this.Days(next_year, next_month)
    // 获取当前月的第一天，最后一天
    let first_date = `${next_year}/${next_month}/1`
    let last_date = `${next_year}/${next_month}/${days}`;
    let marklist = this.getMarkDate(first_date, last_date)
    this.setState({
      min_date: mindate,
      selectdate: mindatetext,
      marks: marklist
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  ClickDay = (e) => {
    let value = e.value;
    let select_date;
    if (value.end) {
      let start_date = value.start;
      let end_date = value.end;
      select_date = this.getDayAll(start_date, end_date).toString()
    } else {
      select_date = this.getDayAll(value.start, value.start).toString()
    }
    this.setState({
      selectdate: select_date
    })
  }

  // 获取两个时间段内所有日期
  getDayAll = (starDay, endDay) => {

    let arr = [];
    let dates = [];

    // 设置两个日期UTC时间
    let db = new Date(starDay)
    let de = new Date(endDay)

    // 获取两个日期GTM时间
    let s = db.getTime() - 24 * 60 * 60 * 1000;
    let d = de.getTime() - 24 * 60 * 60 * 1000;

    // 获取到两个日期之间的每一天的毫秒数
    for (let i = s; i <= d;) {
      i = i + 24 * 60 * 60 * 1000;
      arr.push(parseInt(i))
    }

    // 获取每一天的时间  YY-MM-DD
    for (let j in arr) {
      var time = new Date(arr[j])
      var year = time.getFullYear(time)
      var mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
      var day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
      var YYMMDD = year + '年' + mouth + '月' + day + '日';
      dates.push(YYMMDD)
    }

    return dates
  }

  // 月份改变时触发
  onMonthChange = (value) => {
    //判断当前月份是否已经缓存
    // if (this.state.markMap.indexOf(value) === -1) {
    let date = new Date(value)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    // 获取当前月份有几天
    let days = this.Days(year, month)
    // 获取当前月的第一天，最后一天
    // let first_date = `${next_year}/${next_month}/1`
    let last_date = `${year}/${month}/${days}`
    let marklist = this.getMarkDate(value, last_date)
    this.setState({
      marks: marklist
    })
    // }
  }

  // 获取某个月的周一，周三，周五的天数
  getMarkDate(start, end) {
    let list = this.getDayAll(start, end)
    let marklist = []
    for (let index = 0; index < list.length; index++) {
      let temp = list[index].replace(/年/g, "/").replace(/月/g, "/").replace(/日/g, "")
      if (this.iSMarkitem(temp)) {
        marklist.push({ value: temp })
      }
    }
    return marklist
  }

  // 获取当前月份天数
  Days = (year, month) => {
    let temp = new Date(year, month, 0)
    return temp.getDate()
  }

  // 判断是不是周一，周三，周五
  iSMarkitem = (date) => {
    let day = new Date(date).getDay()
    if (day === 1 || day === 3 || day === 5) {
      return true
    }
    return false;
  }


  render() {
    let { min_date, selectdate, marks } = this.state
    return (
      <View className='index'>
        {min_date && <AtCalendar isMultiSelect currentDate={{ start: min_date, end: min_date }} minDate={min_date} onSelectDate={this.ClickDay.bind(this)} marks={marks} onMonthChange={this.onMonthChange.bind(this)} />}
        {selectdate && <Text>选中日期：{selectdate}</Text>}
      </View>
    )
  }
}
