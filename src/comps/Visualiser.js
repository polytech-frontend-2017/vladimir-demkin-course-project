import React, { Component } from "react";
import ReactDom from "react-dom";
import { Tabs, Tab } from "react-bootstrap";
import * as d3 from "d3";
import { Switch, Redirect } from "react-router";
import Chart from "../lib/components/Chart";

require("./Visualiser.css");

class Visualiser extends Component {
  constructor(props) {
    super(props);
    var pieData = {};
    var bubbleData = {};
    var barData = [];
    bubbleData["children"] = [];
    this.props.dataSet.forEach(element => {
      pieData[element["name"]] = element["value"];
      bubbleData["children"].push(element);
      barData.push({ xValue: element["name"], yValue: element["value"] });
    });
    this.state = {
      pieData: pieData,
      bubbleData: bubbleData,
      barData: barData
    };
  }
  componentWillReceiveProps(nextProps) {
    var pieData = {};
    var bubbleData = {};
    var barData = [];
    bubbleData["children"] = [];
    nextProps.dataSet.forEach(element => {
      pieData[element["name"]] = element["value"];
      bubbleData["children"].push(element);
      barData.push({ xValue: element["name"], yValue: element["value"] });
    });
    this.setState = {
      pieData: pieData,
      bubbleData: bubbleData,
      barData: barData
    };
  }
  render() {
    return (
      <div className="visualiser-visdiv">
        <Tabs defaultActiveKey={1} id="uncontrolled-tab">
          <Tab eventKey={1} title="Pie chart">
            <div className="visualiser-chart">
              <Chart
                type={"pie"}
                width={900}
                height={600}
                showTooltips={true}
                data={this.state.pieData}
                showLegend={true}
              />
            </div>
          </Tab>
          <Tab eventKey={2} title="Bubble chart">
            <Chart
              className="chart"
              type={"bubble"}
              diameter={700}
              showTooltips={true}
              data={this.state.bubbleData}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
export default Visualiser;
