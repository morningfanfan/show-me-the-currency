import React from 'react';
import { Row, Col, Icon } from 'antd';
import * as V from 'victory';
import _ from "lodash";

class CurrencyParent extends React.Component {

    constructor() {
      super();
      this.state = {
          rateRange: [],
          liveData: "x"
      };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.symbol !== this.props.symbol) {
            this.fetchData(nextProps.symbol)
            this.liveData(nextProps.symbol)
        }
    }

    fetchData(symbol) {
      let myStorage = window.localStorage;
      if (myStorage.getItem(symbol) === null) {
        const my_key = "7f21d6e5387381e9c5ab93d0eefc3af5"
        const backup_key = "8703da158c3d1333f6d3e77f9b747098"
        let futures = []
        let flag = false;
        for(let i = 2010; i <= 2018; i += 0.5){
          let year, month;
          if (!flag) {
              year = i.toString()
              month = "01"
              flag = true
          } else {
              year = i - 0.5
              year = year.toString()
              month = "06"
              flag = false
          }
          let date = year + "-" + month + "-" + "01"
          let request_url = `http://data.fixer.io/api/${date}?access_key=${my_key}&symbols=${symbol}`
          let future = fetch(request_url).then(response => response.json())
          futures.push(future)
        }

        Promise.all(futures).then((data) => {
            let rateRange = data.map((data) => [data.rates[symbol], data.date])
            rateRange = _.sortBy(rateRange, ([rates, date]) => {
              return date;
            })
            myStorage.setItem(symbol, JSON.stringify(rateRange));
            this.setState({
                rateRange: rateRange
            })
        })
      } else {
        this.setState({
          rateRange: JSON.parse(myStorage.getItem(symbol))
        });
      }
    }
    liveData(symbol){
      const my_key = "7f21d6e5387381e9c5ab93d0eefc3af5"
      const backup_key = "8703da158c3d1333f6d3e77f9b747098"
      let request_url = `http://data.fixer.io/api/latest?access_key=${backup_key}&symbols=${symbol}`
      fetch(request_url)
      .then(response => response.json())
      .then((data) => {
        var int_data = parseFloat(data.rates[symbol]).toFixed(3)
        this.setState({
          liveData: int_data
        }) 
        })
      
    }
    componentDidMount() {
      console.log("1")
      var symbol =this.props.symbol

      this.fetchData(symbol)
      this.liveData(symbol)

      const my_key = "7f21d6e5387381e9c5ab93d0eefc3af5"
      const backup_key = "8703da158c3d1333f6d3e77f9b747098"
      let request_url = `http://data.fixer.io/api/latest?access_key=${my_key}&symbols=${symbol}`

      this.interval = setInterval(function(){ 
      fetch(request_url)
      .then(response => response.json())
      .then((data) => {
        var int_data = parseFloat(data.rates[symbol]).toFixed(3)
        this.setState({
          liveData: int_data
        })
        })
      }.bind(this), 3600000);
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }

    render() {
        return (
        <div>
        <Row className="title">
            <h2>
            <Col span={24}><span><Icon type="calculator" /><span>&nbsp;Live Currency</span></span></Col>
            </h2>
        </Row>
        <Row className="rowBorder">
        <Col span={12} offset={6}>
        <h1 style={{ margin: '0' }} className="heading heading-correct-pronounciation">
        <span className="currencyNum">{this.state.liveData}</span>
        <span ><em>{this.props.symbol}</em></span>
        <span> = </span>
        <span className="currencyNum">1</span> 
        <span><em>EUR</em></span>
        </h1>
        </Col>
        </Row>
        <Row className="title" style={{marginTop: '2em'}}>
        <h2>
        <Col span={24}><span><Icon type="line-chart" /><span>&nbsp;Trend in past ten years</span></span></Col>
        </h2>
        </Row>
        <Row className="rowBorder">
        <Col span={12} offset={6}><CurrencyChild rateRange={this.state.rateRange}/></Col>
        </Row>
        </div>
        ) 
    }
}

class CurrencyChild extends React.Component {
    constructor() {
      super();
      this.state = {};
    }
    
    componentWillReceiveProps(nextProps) {
      this.setState({zoomDomain: undefined, selectedDomain: undefined})
    }

    handleZoom(domain) {
      this.setState({selectedDomain: domain});
    }
  
    handleBrush(domain) {
      this.setState({zoomDomain: domain});
    }

    explainRateRange(arr) {
      let result = arr.map(([rate, date]) => {
        let dateGroup = date.split("-");
        return {x: new Date(parseInt(dateGroup[0]), parseInt(dateGroup[1]), 1), y: rate};
      })
      return result
    }

    render() {
      console.log()
      const { rateRange } = this.props;
      let line = (
      <V.VictoryLine
        style={{
          data: {stroke: "tomato"}
        }}
        data={this.explainRateRange(rateRange)}
      />);

      return (
          <div>
              <V.VictoryChart width={600} height={350} scale={{x: "time"}}
                containerComponent={
                  <V.VictoryZoomContainer responsive={false}
                    zoomDimension="x"
                    zoomDomain={this.state.zoomDomain}
                    onZoomDomainChange={this.handleZoom.bind(this)}
                  />
                }
              >
                {line}
              </V.VictoryChart>
    
              <V.VictoryChart
                padding={{top: 0, left: 50, right: 50, bottom: 30}}
                width={600} height={90} scale={{x: "time"}}
                containerComponent={
                  <V.VictoryBrushContainer responsive={false}
                    brushDimension="x"
                    brushDomain={this.state.selectedDomain}
                    onBrushDomainChange={this.handleBrush.bind(this)}
                  />
                }
              >
                <V.VictoryAxis
                  tickValues={[
                    new Date(2010, 1, 1),
                    new Date(2012, 1, 1),
                    new Date(2014, 1, 1),
                    new Date(2016, 1, 1),
                    new Date(2018, 1, 1),
                  ]}
                  tickFormat={(x) => new Date(x).getFullYear()}
                />
                {line}
              </V.VictoryChart>
          </div>
        )
    }
}

export default CurrencyParent;