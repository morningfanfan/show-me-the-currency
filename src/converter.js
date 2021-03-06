import React from 'react';
import { Icon, Row, Col, Table, Button, Input, Select, message} from 'antd';
const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;
const Option = Select.Option;
// const convtStyle = {font:serif};

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
      amount2:1.229861,
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

}
_handleChange2(e){
  this.setState({cur2:e});

}

  handleConvert(){

    let url = "https://data.fixer.io/api/latest?access_key=2490818d4ea1413695d9318dff4c1fb5";
    fetch(url).then(response => {
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
        }else if((s[i]-tmp[i])<0){
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
        <p className = "convlabel"><Icon type="shop" />&nbsp;Currency Converter</p>
        <Row type="flex" justify="center" align="bottom">
        
            <Col span={6} className = "convfield">
            <DemoBox value={100}>Currency I have</DemoBox>
            </Col>
            <Col span={6} >
            <DemoBox value={100}></DemoBox>
            </Col>
            <Col span={6} className = "convfield">
            <DemoBox value={50}>Currency I want</DemoBox>
            </Col>
        </Row>

        <Row type="flex" justify="center" align="bottom">
            <Col span={6}  >
            <Select  className = "letstry" defaultValue="EUR" style={{width:150 }} onChange={this._handleChange1.bind(this)}>
      <Option value="EUR" >EUR</Option>
      <Option value="USD">USD</Option>
      <Option value="CAD">CAD</Option>
      <Option value="GBP">GBP</Option>
      <Option value="CNY">CNY</Option>
      <Option value="AUD">AUD</Option>
    </Select>
            </Col>
            <Col span={6}></Col>
            <Col span={6} >
            <Select className = "letstry" defaultValue="USD"  style={{ width: 150 }} onChange={this._handleChange2.bind(this)}>
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
            <Col span={6}  className = "convfield">
            <DemoBox value={50}>Amount</DemoBox>
            </Col>
            <Col span={6} >
            <DemoBox value={50}><Button className = "convBtn" type="primary" onClick = {()=>this.handleConvert()}>
            <Icon type="sync" />Convert
            </Button></DemoBox>
            </Col>
            <Col span={6} className = "convfield">
            <DemoBox  value={50}>Amount</DemoBox>
            </Col>
        </Row>

        <Row type="flex" justify="center" align="bottom">
            <Col span={6} >
            <Input className = "lestry" id = "a1" placeholder="1" defaultValue = "1"  style={{ width: 150 }}/>
            </Col>
            <Col span = {6}></Col>
            <Col span={6}>
            <Input  className = "letstry" value = {this.state.amount2} style={{ width: 150 }}/>
            </Col>
        </Row>

        <br/>
        <br/>

        </Col>
        <Col>
        <p className = "convlabel"><Icon type="clock-circle-o" />&nbsp;Live Currency Rate Trend</p>
        <Table  className = "convtable"  dataSource={this.state.dataSource } columns={columns} pagination={false}/>
        </Col>
    </Row>
</div>
      )
  }
}
export default Converter