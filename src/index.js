import React from 'react';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Select } from 'antd';
import { Modal, Button } from 'antd';
import './index.css';
import 'antd/dist/antd.css';
import _ from "lodash";

const { Header, Content, Footer, Sider } = Layout;
const Option = Select.Option;
const { SubMenu } = Menu

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



class App extends React.Component { 
      constructor() {
        super();
        this.state = {
            collapsed: false,
            kind:["CNY","CAD"],
            selectKind: "CNY",
            add: false
        };
      }
      onCollapse = (collapsed) => {
        this.setState({ collapsed });
      }
      changeSelect(item){
          var i = parseInt(item.key)
          if (i>=0){
            this.setState({
                selectKind: this.state.kind[parseInt(item.key)]
            })
          }
          else if(i=="addMore") {
              this.setState({
                  add: true
              })
          }
      }
      menu(kind) {
        var result = []
          for(var i = 0; i < kind.length; i ++){
            result.push(
            <Menu.Item key={i.toString()}>
            <Icon type="area-chart" />
            <span>&nbsp;{kind[i]}</span>
            </Menu.Item>
            )
          }
          return result
      }
      handleClick (item) {
        console.log(item.key)
        if (item.key == "addMore" && !this.state.add){
              this.setState({
                  add: true
              })
          }
      }
      handleChange = (value) => {
        this.setState({
          maybeUseful: value
        })
      }
      handleOk = (e) => {
        this.setState({
         add: false,
         kind: this.state.maybeUseful
        });
      }
      handleCancel = (e) => {
        this.setState({
          add: false
        });
      }
      addMore() {
        return (
          <div>
            <Modal
              title="Basic Modal"
              visible={this.state.add}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
            <SelectKind handleChange={this.handleChange} currencies={this.state.kind} sync={this.state.add}/>
            </Modal>
          </div>
        )
      }

    render() {
        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <div className="logo" />
              <Menu theme="dark" defaultSelectedKeys={['first']} defaultOpenKeys={['subfirst','subsecond']}
              mode="inline" onSelect={this.changeSelect.bind(this)} 
              onClick={this.handleClick.bind(this)}>
              <Menu.Item key="first">
              <Icon type="smile" />
              <span>&nbsp;Welcome</span>
              </Menu.Item>
              <SubMenu key="subfirst" title={<span><Icon type="appstore" /><span>&nbsp;Product</span></span>}>
              <Menu.Item key="subsubfirst">
              <Icon type="sync" />
              <span>&nbsp;Converter</span>
              </Menu.Item>
              <SubMenu key="subsecond" title={<span><Icon type="pay-circle" /><span>&nbsp;Currencies</span></span>}>
              {this.menu(this.state.kind)}
              <Menu.Item key="addMore">
              <Icon type="plus-square" />
              <span>&nbsp;Add More</span>
              </Menu.Item>
              </SubMenu>
              </SubMenu>
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }} />
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Currency</Breadcrumb.Item>
                  <Breadcrumb.Item>{this.state.selectKind}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                  <CurrencyParent symbol={this.state.selectKind}/>
                {this.addMore()}
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
              </Footer>
            </Layout>
          </Layout>
        )
    }
}




const currencyKind =["CAD","CNY","USD","AUD","CHF","GBP","JPY","KRW","HKD","SGD"]
class SelectKind extends React.Component {
  state = {
    currencies: [],
  }
  constructor() {
    super();
    this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      currencies: this.props.currencies,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.sync && nextProps.sync) { 
      this.setState({
        currencies: nextProps.currencies,
      })
    }
  }
  
  onSelectionChange(data) {
    this.setState({currencies: data})
    this.props.handleChange(data)
  }
  render() {
    const children = [];
    for (let i = 0; i < 10; i++) {
      children.push(<Option key={currencyKind[i]}>{currencyKind[i]}</Option>);
    }
    const { size } = this.state;
    return (
      <div>
        <Select
          mode="multiple"
          size="default"
          placeholder="Please select"
          onChange={this.onSelectionChange}
          value={this.state.currencies}
          style={{ width: '100%' }}
        >
          {children}
        </Select>
      </div>
    );
  }
}


const app = document.getElementById('root');
ReactDOM.render(<App />, app);