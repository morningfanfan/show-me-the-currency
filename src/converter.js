import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Cascader, Row, Col, Table, Button, Input, Form, Select, message} from 'antd';

const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;
const { SubMenu } = Menu;
const { Content, Footer, Sider } = Layout;
const Option = Select.Option;


const columns = [{
  title: 'Currency',
  dataIndex: 'currency',
  key: 'currency',
  className:'alignCenter',
}, {
  title: 'Rate',
  dataIndex: 'rate',
  key: 'rate',
  className:'alignCenter',
}, {
  title: 'Change',
  dataIndex: 'change',
  key: 'change',
  className:'alignCenter',
}];


class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cur1:"EUR",
      cur2: "USD",
      rate: 0,
      amount2:1.22961,
      dataSource: [{
        key: '1',
        currency: 'EUR/USD',
        rate: 6.329905,
        change: <Icon type="caret-up" />
      }, {
        key: '2',
        currency: 'USD/CNY',
        rate: 1.132904,
        change: <Icon type="caret-up" />
      }, {
        key: '3',
        currency: 'EUR/GBP',
        rate: 1.309204,
        change: <Icon type="caret-down" />
      },{
        key: '4',
        currency: 'USD/CAD',
        rate: 4.834926,
        change: <Icon type="caret-up" />
      }, {
        key: '5',
        currency: 'CAD/CNY',
        rate: 1.593284,
        change: <Icon type="caret-down" />
      }]
    };   
  }

_handleChange1(e){
  this.setState({cur1:e});
  console.log("cur1statechanged");
}
_handleChange2(e){
  this.setState({cur2:e});
  console.log("cur2statechanged");
}

  handleConvert(){

    let url = "https://data.fixer.io/api/latest?access_key=ada017a06e6e9c7d859663c60041471a";
    let data = fetch(url).then(response => {
      return response.json();
    }).then(data => {
      let cur1 = this.state.cur1;
      let cur2 = this.state.cur2;
      let result = (data["rates"][cur2])/(data["rates"][cur1]);
      this.setState({rate: result});
      let amount1 = document.getElementById("a1").value;
      // debugger;
      if (isNaN(amount1)){
        message.warning("Amount must be a number!");
      }else if(amount1 < 0){
        message.warning("Amount must be greater than zero!");
      }else{
        amount1 = parseFloat(document.getElementById("a1").value, 10);
        let cal = (amount1 * this.state.rate).toFixed(6);
        this.setState({amount2:cal});
      }

      const foo = this.state.dataSource;
      let s = [parseFloat((data["rates"]["USD"])/(data["rates"]["EUR"]), 10).toFixed(6), parseFloat((data["rates"]["CNY"])/(data["rates"]["USD"]), 10).toFixed(6), parseFloat((data["rates"]["EUR"])/(data["rates"]["GBP"]), 10).toFixed(6), parseFloat((data["rates"]["CAD"])/(data["rates"]["USD"]), 10).toFixed(6), parseFloat((data["rates"]["CNY"])/(data["rates"]["CAD"]), 10).toFixed(6)];
      let tmp = [foo[0].rate, foo[1].rate, foo[2].rate, foo[3].rate, foo[4].rate];

      for (let i=0; i<5; i++){
        foo[i].rate = s[i];
        if ((s[i]-tmp[i])>0){
          foo[i].change = <Icon type="caret-up" />;
        }else{
          foo[i].change = <Icon type="caret-down" />;
        }
      }
      this.setState({dataSource:foo});
      console.log(this.state.dataSource);
    });
    }

  render(){
      return(
        <div>
    <Row>
        <Col>
        <br/>

        <Row type="flex" justify="center" align="bottom">
            <Col span={6}>
            <DemoBox value={100}>Currency I have</DemoBox>
            </Col>
            <Col span={6}>
            <DemoBox value={100}></DemoBox>
            </Col>
            <Col span={6}>
            <DemoBox value={50}>Currency I want</DemoBox>
            </Col>
        </Row>

        <Row type="flex" justify="center" align="bottom">
            <Col span={6}>
            <Select defaultValue="EUR" style={{ width: 120 }} onChange={this._handleChange1.bind(this)}>
      <Option value="EUR">EUR</Option>
      <Option value="USD">USD</Option>
      <Option value="CAD">CAD</Option>
      <Option value="GBP">GBP</Option>
      <Option value="CNY">CNY</Option>
      <Option value="AUD">AUD</Option>
    </Select>
            </Col>
            <Col span={6}></Col>
            <Col span={6}>
            <Select defaultValue="USD"  style={{ width: 120 }} onChange={this._handleChange2.bind(this)}>
      <Option value="EUR">EUR</Option>
      <Option value="USD">USD</Option>
      <Option value="CAD">CAD</Option>
      <Option value="GBP">GBP</Option>
      <Option value="CNY">CNY</Option>
      <Option value="AUD">AUD</Option>
    </Select>
            </Col>
        </Row>

        <br/>

        <Row type="flex" justify="center" align="bottom">
            <Col span={6} >
            <DemoBox value={50}>Amount</DemoBox>
            </Col>
            <Col span={6} >
            <DemoBox value={50}><Button type="primary" onClick = {()=>this.handleConvert()}>
            <Icon type="sync" />Convert
            </Button></DemoBox>
            </Col>
            <Col span={6}>
            <DemoBox value={50}>Amount</DemoBox>
            </Col>
        </Row>

        <Row type="flex" justify="center" align="bottom">
            <Col span={6} >
            <Input id = "a1" defaultValue = "1"  style={{ width: 120 }}/>
            </Col>
            <Col span = {6}></Col>
            <Col span={6}>
            <Input defaultValue = "1.229861"  value = {this.state.amount2} style={{ width: 120 }}/>
            </Col>
        </Row>

        <br/>
        <br/>

        </Col>
        <Col>
        <p><Icon type="clock-circle-o" />&nbsp;Hot Live Currency Rate</p>
        <Table dataSource={this.state.dataSource} columns={columns} pagination={{ pageSize:5 }}/>
        </Col>
    </Row>
</div>
      )
  }
}
export default Converter