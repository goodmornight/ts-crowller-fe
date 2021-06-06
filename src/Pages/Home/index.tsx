import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, message } from 'antd';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import request from '../../request';
import moment from 'moment';
import './style.css';

interface CourseItem {
  title: string;
  count: number;
}

interface State {
  loaded: boolean;
  isLogin: boolean;
  data: {
    [key: string]: CourseItem[]
  }
}

class Home extends Component {
  state: State = {
    loaded: false,
    isLogin: true,
    data: {}
  };

  componentDidMount() {
    request.get('/api/isLogin').then(res => {
      if (!res) {
        this.setState({
          isLogin: false,
          loaded: true
        });
      } else {
        this.setState({
          loaded: true
        });
      }
    });

    request.get('/api/showData').then(res => {
      if (res) {
        this.setState({
          data: {...this.state.data, ...res}
        })
      }
    });
  }

  handleCrowllerClick = () => {
    request.get('/api/getData').then(res => {
      if (res.data) {
        message.success('爬取成功');
      } else {
        message.error('爬取失败');
      }
    });
  }

  handleLogoutClick = () => {
    request.get('/api/logout').then(res => {
      if (res) {
        this.setState({
          isLogin: false
        });
      } else {
        message.error('退出失败');
      }
    });
  }

  getOption = () => {
    const { data } = this.state;
    const courseNames: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for(let i in data) {
      const item = data[i];
      times.push(moment(Number(i)).format('MM-DD HH:mm'));
      item.forEach(inner => {
        const { title, count } = inner;
        if (courseNames.indexOf(title) === -1) {
          courseNames.push(title);
        }
        tempData[title] ? tempData[title].push(count) : (tempData[title] = [count]);
      })
    }
    console.log(times)
    const result: echarts.LineSeriesOption[] = [];
    for (let i in tempData) {
      result.push({
        name: i,
        type: 'line',
        data: tempData[i]
      });
    }
    return {
      title: {
        text: '课程在线学习人数'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: courseNames
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times
      },
      yAxis: {
        type: 'value'
      },
      series: result
    };
  }

  render() {
    const { isLogin, loaded } = this.state;
    if (isLogin) {
      if (loaded) {
        return (
          <div className="home-page">
            <div className="buttons">
              <Button type="primary" style={{ marginRight: '10px' }}  onClick={this.handleCrowllerClick}>
                爬取
              </Button>
              <Button type="primary" onClick={this.handleLogoutClick}>退出</Button>
            </div>
            <ReactEcharts option={this.getOption()} />
          </div>
        );
      }
      return null;
    }
    return <Redirect to="/login" />;
  }
}

export default Home;
