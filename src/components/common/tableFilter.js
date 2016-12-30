import React, {PropTypes, Component} from "react";
import {hashHistory} from "react-router";
import * as ColumnTypes from "./../../constants/reportColumnTypes";
import * as AlgorithmTypes from "./../../constants/algorithmTypes";
import format from "date-format";
import * as Orders from "./../../constants/orders";

export default class TableFilter extends Component {

  constructor(props) {
    super(props);

    this.state = TableFilter.getParams(props);
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    algorithms: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  componentWillReceiveProps(props) {
    this.state = TableFilter.getParams(props);
  }

  onEnter = (e) => {
    if (e.key === "Enter" || e.currentTarget.name == "UPDATED_FROM" || e.currentTarget.name == "UPDATED_TO") {
      let str = JSON.stringify(this.state);
      this.props.location.query.filter = str != "{}" ? str : undefined;
      hashHistory.push(this.props.location);
      this.props.onChange(this.state);
    }
  };

  static getParams = (props) => {
    return JSON.parse(props.location.query.filter || "{}");
  };

  static clearFilters = (props) => {
    props.location.query.filter = undefined;
    hashHistory.push(props.location);
  };

  static setPreset = (props, preset) => {
    let filter = JSON.parse(props.location.query.filter || "{}");
    filter.preset = preset;
    delete filter["UPDATED_FROM"];
    delete filter["UPDATED_TO"];
    props.location.query.filter = JSON.stringify(filter);
    hashHistory.push(props.location);
  };

  static toQueryParams = (params) => {
    if (params.filter == undefined) {
      params.filter = {};
    }

    let baseDate = null;
    let startDate = null;
    let endDate = null;

    switch (Number(params.filter.preset)) {
      case 1: //today
        baseDate = format("yyyy-MM-dd", new Date());
        params.filter.UPDATED_FROM = new Date(baseDate).getTime() / 1000 + (new Date().getTimezoneOffset()) * 60;
        params.filter.UPDATED_TO = new Date(baseDate).getTime() / 1000 + 86400 + (new Date().getTimezoneOffset()) * 60;
        break;
      case 2: //yesterday
        baseDate = format("yyyy-MM-dd", new Date(new Date().getTime() - 86400 * 1000));
        params.filter.UPDATED_FROM = new Date(baseDate).getTime() / 1000 + (new Date().getTimezoneOffset()) * 60;
        params.filter.UPDATED_TO = new Date(baseDate).getTime() / 1000 + 86400 + (new Date().getTimezoneOffset()) * 60;
        break;
      case 3: //last 7 days
        baseDate = format("yyyy-MM-dd", new Date());
        params.filter.UPDATED_FROM = new Date(baseDate).getTime() / 1000 - (7 * 86400) + (new Date().getTimezoneOffset()) * 60;
        params.filter.UPDATED_TO = new Date(baseDate).getTime() / 1000 + 86400 + (new Date().getTimezoneOffset()) * 60;
        break;
      case 4: // this month
        startDate = new Date();
        startDate = new Date(`${startDate.getFullYear()}-${(startDate.getMonth() + 1)}-01`);

        endDate = new Date();
        endDate = new Date(`${endDate.getFullYear()}-${(endDate.getMonth() + 2)}-01`);

        params.filter.UPDATED_FROM = new Date(startDate).getTime() / 1000 - (new Date().getTimezoneOffset()) * 60;
        params.filter.UPDATED_TO = new Date(endDate).getTime() / 1000 + (new Date().getTimezoneOffset()) * 60;
        break;
      case 5: // past month
        startDate = new Date();
        startDate = new Date(`${startDate.getFullYear()}-${(startDate.getMonth() + 0)}-01`);

        endDate = new Date();
        endDate = new Date(`${endDate.getFullYear()}-${(endDate.getMonth() + 1)}-01`);

        params.filter.UPDATED_FROM = new Date(startDate).getTime() / 1000 - (new Date().getTimezoneOffset()) * 60;
        params.filter.UPDATED_TO = new Date(endDate).getTime() / 1000 + (new Date().getTimezoneOffset()) * 60;
        break;
      case 6:
        startDate = new Date();
        startDate = new Date(`${startDate.getFullYear()}-${(startDate.getMonth() - 5)}-01`);

        endDate = new Date();
        endDate = new Date(`${endDate.getFullYear()}-${(endDate.getMonth() + 1)}-01`);

        params.filter.UPDATED_FROM = new Date(startDate).getTime() / 1000 - (new Date().getTimezoneOffset()) * 60;
        params.filter.UPDATED_TO = new Date(endDate).getTime() / 1000 + (new Date().getTimezoneOffset()) * 60;
        break;
      case 7:
        delete params.filter["UPDATED_FROM"];
        delete params.filter["UPDATED_TO"];
        break;
      default:
        if (params.filter.UPDATED_FROM == undefined && params.filter.UPDATED_TO == undefined) {
          baseDate = format("yyyy-MM-dd", new Date());
          params.filter.UPDATED_FROM = new Date(baseDate).getTime() / 1000 + (new Date().getTimezoneOffset()) * 60;
          params.filter.UPDATED_TO = new Date(baseDate).getTime() / 1000 + 86400 + (new Date().getTimezoneOffset()) * 60;
        } else {
          if (params.filter.UPDATED_FROM != undefined) {
            params.filter.UPDATED_FROM = new Date(params.filter.UPDATED_FROM).getTime() / 1000 + (new Date().getTimezoneOffset()) * 60;
          }
          if (params.filter.UPDATED_TO != undefined) {
            params.filter.UPDATED_TO = new Date(params.filter.UPDATED_TO).getTime() / 1000 + 86400 + (new Date().getTimezoneOffset()) * 60;
          }
        }
        break;
    }

    return params;
  };

  onChange = (e) => {
    let filter = this.state;

    if (e.currentTarget.value) {
      filter[e.currentTarget.name] = e.currentTarget.value;
    } else {
      delete filter[e.currentTarget.name];
    }

    if (e.currentTarget.name == "UPDATED_FROM" || e.currentTarget.name == "UPDATED_TO") {
      filter.preset = 0;
    }

    this.setState(filter);

    this.onEnter(e);
  };

  render() {
    let availableColumns = [].concat(this.props.user.columns, this.props.algorithms.filter(algorithm => algorithm.active).map(algorithm => algorithm.alias));

    let columns = [].concat(Object.keys(ColumnTypes), Object.keys(AlgorithmTypes).sort((a, b) => Orders[a] > Orders[b] ? -1 : 1));

    columns = columns.filter(column => availableColumns.indexOf(column) != -1);

    return (
      <tr className="filters">
        {columns.map(column => {
          switch (column) {
            case ColumnTypes.ALIAS:
              return (
                <th key={"filter-" + column}>
                  <input onKeyPress={this.onEnter}
                         className="form-control input-sm"
                         type="text"
                         name={column}
                         ref={column}
                         onChange={this.onChange}
                         value={this.state[column] || ""}
                  />
                </th>);
            case ColumnTypes.PROFIT:
            case ColumnTypes.COST:
            case ColumnTypes.REVENUE:
              return (
                <th key={"filter-" + column}>
                  <input onKeyPress={this.onEnter}
                         className="form-control input-sm"
                         type="number"
                         step={0.01}
                         ref={column + "_FROM"}
                         name={column + "_FROM"}
                         onChange={this.onChange}
                         value={this.state[column + "_FROM"] || ""}
                  />
                  <input onKeyPress={this.onEnter}
                         className="form-control input-sm"
                         type="number"
                         step={0.01}
                         ref={column + "_TO"}
                         name={column + "_TO"}
                         onChange={this.onChange}
                         value={this.state[column + "_TO"] || ""}
                  />
                </th>
              );
            case ColumnTypes.CONVERSIONS:
            case AlgorithmTypes.IP_DUPLICATE_DAY:
            case AlgorithmTypes.IP_DUPLICATE:
            case AlgorithmTypes.IP_RANGE_DUPLICATE:
            case AlgorithmTypes.IP_ISP:
            case AlgorithmTypes.IP_ISP2:
            case AlgorithmTypes.DEVICE_STAMP:
            case AlgorithmTypes.VISIT_POSTBACK_DELTA:
              return (
                <th key={"filter-" + column}>
                  <input onKeyPress={this.onEnter}
                         className="form-control input-sm"
                         type="number"
                         step={1}
                         ref={column + "_FROM"}
                         name={column + "_FROM"}
                         onChange={this.onChange}
                         value={this.state[column + "_FROM"] || ""}
                  />
                  <input onKeyPress={this.onEnter}
                         className="form-control input-sm"
                         type="number"
                         step={1}
                         ref={column + "_TO"}
                         name={column + "_TO"}
                         onChange={this.onChange}
                         value={this.state[column + "_TO"] || ""}
                  />
                </th>
              );
            case ColumnTypes.UPDATED:
              return (
                <th key={"filter-" + column}>
                  <input onKeyPress={this.onEnter}
                         className="form-control input-sm"
                         type="date"
                         ref={column + "_FROM"}
                         name={column + "_FROM"}
                         onChange={this.onChange}
                         value={this.state[column + "_FROM"] || ""}
                  />
                  <input onKeyPress={this.onEnter}
                         className="form-control input-sm"
                         type="date"
                         ref={column + "_TO"}
                         name={column + "_TO"}
                         onChange={this.onChange}
                         value={this.state[column + "_TO"] || ""}
                  />
                </th>);
          }
        })}
      </tr>
    );
  }
}
