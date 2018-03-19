import React from 'react';
import ReactDOM from 'react-dom';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Select } from 'antd';
import { Modal } from 'antd';
import './index.css';
import 'antd/dist/antd.css';

import CurrencyParent from './currencyInfo'
import Converter from './converter'
import Welcome from './welcome'

const { Content, Footer, Sider } = Layout;
const Option = Select.Option;
const { SubMenu } = Menu

class App extends React.Component { 
      constructor() {
        super();
        this.state = {
            collapsed: false,
            kind:["CNY","CAD"],
            maybeUseful:["CNY","CAD"],
            selectKind: "CNY",
            add: false,
            showPage: "first"
        };
      }
      onCollapse = (collapsed) => {
        this.setState({ collapsed });
      }
      changeSelect(item){
          var i = parseInt(item.key)
          var key = item.key

          if (i >= 0){
            this.setState({
                selectKind: this.state.kind[i],
                showPage: "currency"
            })
          }
          else if(key === "addMore") {
              this.setState({
                  add: true
              })
          }
          else if(key === "first" || key ==="subsubfirst") {
            this.setState({
              showPage: key
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
        if (item.key === "addMore" && !this.state.add){
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
              title="Choose Currency"
              visible={this.state.add}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
            <SelectKind handleChange={this.handleChange} currencies={this.state.kind} sync={this.state.add}/>
            </Modal>
          </div>
        )
      }
      showContent(){
        var showPage = this.state.showPage
        if (showPage === "first") {
          return <Welcome/>
        }
        else if (showPage === "subsubfirst") {
          return <Converter/>
        }
        else if (showPage === "currency") {
          return <CurrencyParent symbol={this.state.selectKind}/>
        }
      }
      showBread () {

        var showPage = this.state.showPage

        if (showPage === "first") {
          return (
            <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Welcome</Breadcrumb.Item>
            </Breadcrumb>
          )
          
        }
        else if (showPage === "subsubfirst") {
          return (
          <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Product</Breadcrumb.Item>
          <Breadcrumb.Item>Converter</Breadcrumb.Item>
          </Breadcrumb>
          )
      }
        else if (showPage === "currency") {
          return (
          <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Product</Breadcrumb.Item>
          <Breadcrumb.Item>Currency</Breadcrumb.Item>
          <Breadcrumb.Item>{this.state.selectKind}</Breadcrumb.Item>
          </Breadcrumb>
          )
          }
      }

    render() {

        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <div className="logo" >
              
              <span><img className="logoImg" src="https://s3.us-east-2.amazonaws.com/showmethecurrency/Money.png"></img>SMTC</span>
              </div>
              <Menu theme="dark" defaultSelectedKeys={['first']} defaultOpenKeys={['subfirst','subsecond']}
              mode="inline" onSelect={this.changeSelect.bind(this)} 
              onClick={this.handleClick.bind(this)}>
              <Menu.Item key="first">
              <Icon type="smile" />
              <span>&nbsp;Welcome</span>
              </Menu.Item>
              <SubMenu key="subfirst" title={<span><Icon type="appstore" /><span>&nbsp;Product</span></span>}>
              <Menu.Item key="subsubfirst">
              <Icon type="heart" />
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
              <Content style={{ margin: '0 16px' }}>
                  {this.showBread()}
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                  {this.showContent()}
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