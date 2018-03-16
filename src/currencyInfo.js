import React, { Component } from 'react';
import * as V from 'victory';
import _ from "lodash";

class CurrencyParent extends React.Component {

    constructor() {
      super();
      this.state = {
          rateRange: []
      };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.symbol !== this.props.symbol) {
            this.fetchData(nextProps.symbol)
        }
    }

    componentDidMount() {
        this.fetchData(this.props.symbol)
    }

    fetchData(symbol) {
      let myStorage = window.localStorage;
      if (myStorage.getItem(symbol) === null) {
        const my_key = "7f21d6e5387381e9c5ab93d0eefc3af5"
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

    render() {
        return <CurrencyChild rateRange={this.state.rateRange}/>  
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