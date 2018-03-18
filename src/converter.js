import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Cascader, Row, Col, Table, Button, Input, Form, Select} from 'antd';

const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;
const { SubMenu } = Menu;
const { Content, Footer, Sider } = Layout;
const Option = Select.Option;


const columns = [{
  title: 'Currency',
  dataIndex: 'currency',
  key: 'currency',
}, {
  title: 'Rate',
  dataIndex: 'rate',
  key: 'rate',
}, {
  title: 'Change',
  dataIndex: 'change',
  key: 'change',
}];


class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cur2: "USD",
      rate: 0,
      amount2:null,
      dataSource: [{
        key: '1',
        currency: 'EUR/USD',
        rate: 1.229951,
        change: <Icon type="caret-up" />
      }, {
        key: '2',
        currency: 'EUR/CAD',
        rate: 1.610257,
        change: <Icon type="caret-down" />
      }, {
        key: '3',
        currency: 'EUR/GBP',
        rate: 0.882687,
        change: <Icon type="caret-down" />
      },{
        key: '4',
        currency: 'EUR/CNY',
        rate: 7.785474,
        change: <Icon type="caret-down" />
      }, {
        key: '5',
        currency: 'EUR/AUD',
        rate: 1.593284,
        change: <Icon type="caret-down" />
      }]
    };   
  }
  
_handleChange(e){
  
  this.setState({cur2:e});
  console.log("changed");
}

  handleConvert(){

    let url = "https://data.fixer.io/api/latest?access_key=ada017a06e6e9c7d859663c60041471a";
    let data = fetch(url).then(response => {
      return response.json();
    }).then(data => {
      let cur2 = this.state.cur2;
      let result = data["rates"][cur2];
      this.setState({rate: result});
      let amount1 = parseFloat(document.getElementById("a1").value, 10);
      let cal = amount1 * this.state.rate;
      this.setState({amount2:cal});
      // debugger;
      
      
      const foo = this.state.dataSource;
      let s = [data["rates"]["USD"], data["rates"]["CAD"], data["rates"]["GBP"], data["rates"]["CNY"], data["rates"]["AUD"]];
      let tmp = [foo[0].rate, foo[1].rate, foo[2].rate, foo[3].rate, foo[4].rate];

      for (let i=0; i<5; i++){
        foo[i].rate = s[i];
        if ((s[i]-tmp[i])>=0){
          foo[i].change = <Icon type="caret-up" />;
        }else{
          foo[i].change = <Icon type="caret-down" />;
        }
      }
      this.setState({dataSource:foo});
    });
    }

  render(){
      return(
        <div>
    <Row>
        <Col>
        <br/>

        <Row type="flex" justify="center" align="bottom">
            <Col span={6} offset = {1}>
            <DemoBox value={100}>Currency I have</DemoBox>
            </Col>
            <Col span={6} ><DemoBox value={100}></DemoBox></Col>
            <Col span={6}>
            <DemoBox value={50}>Currency I want</DemoBox>
            </Col>
        </Row>

        <Row type="flex" justify="center" align="bottom">
            <Col span={6}>
            <Select defaultValue="EUR" style={{ width: 120 }} onChange={this._handleChange.bind(this)}>
      <Option value="EUR">EUR</Option>
    </Select>
            </Col>
            <Col span={6}></Col>
            <Col span={6}>
            <Select defaultValue="USD"  style={{ width: 120 }} onChange={this._handleChange.bind(this)}>
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
            <Col span={6} offset = {2}>
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
            <Input id = "a1" ref = "a1" placeholder="1"/>
            </Col>
            <Col span = {6}></Col>
            <Col span={6}>
            <Input placeholder="" value = {this.state.amount2} placeholder = "1.22961"/>
            </Col>
        </Row>

        <br/>
        <br/>

        </Col>
        <Col>
        <p><Icon type="clock-circle-o" />&nbsp;Live Currency Rate</p>
        <Table dataSource={this.state.dataSource} columns={columns}/>
        </Col>
    </Row>
</div>
      )
  }
}
export default Converter