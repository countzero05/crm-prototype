import React, {Component, PropTypes} from "react";
import Table from "react-toolbox/lib/table";
import {Button} from "react-toolbox/lib/button";
import style from "./../../static/stylesheets/style.scss";
import Navigation from "react-toolbox/lib/navigation";
import Dropdown from "react-toolbox/lib/dropdown";
import PaginationDropDownTheme from "./../../static/stylesheets/PaginationDropdown.scss";

export default class _Table extends Component {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pagination: PropTypes.bool,
    selectable: PropTypes.bool,
    onChangePage: PropTypes.func,
    onChangePerPage: PropTypes.func,
    model: PropTypes.object.isRequired,
    sortColumn: PropTypes.string,
    sortOrder: PropTypes.string,
    onChangeSort: PropTypes.func,
    hash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    theme: PropTypes.shape({
      table: PropTypes.string
    })
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.hash != this.props.hash;
  }

  render() {
    let {page, perPage, defaultPage, defaultPerPage, sortColumn, sortOrder, model} = this.props;

    page = page || defaultPage;
    perPage = perPage || defaultPerPage;

    if (this.props.onChangeSort) {
      model = Object.keys(model).reduce((self, current) => {
        if (self[current].sortable) {
          if (sortColumn == current) {
            self[current] = {
              ...self[current],
              title: (<div onClick={this.props.onChangeSort.bind(this, current, sortOrder == "ASC" ? "DESC" : "ASC")}
                           className={style[sortOrder == "ASC" ? "up-chevron" : "down-chevron"]}>
                <div className={style["sort-chevron"]}>{self[current].title ? self[current].title : current}</div>
              </div>)
            };
          } else {
            self[current] = {
              ...self[current],
              title: (<div onClick={this.props.onChangeSort.bind(this, current, "ASC")}
                           className={style["sort-chevron"]}>{self[current].title ? self[current].title : current}</div>)
            };
          }
        }
        return self;
      }, {...model});
    }

    // debugger;

    return (
      <div style={{flex: 1, display: "flex"}}>
        {page && perPage ? (<Navigation className={style.pagination}>Rows per page: <Dropdown
            auto
            theme={PaginationDropDownTheme}
            source={[
              {value: "10", label: 10},
              {value: "15", label: 15},
              {value: "25", label: 25},
              {value: "50", label: 50},
              {value: "75", label: 75},
              {value: "100", label: 100},
              {value: "200", label: 200},
            ]}
            value={perPage}
            onChange={this.props.onChangePerPage}
          />page {page} of {Math.ceil(this.props.count / perPage)}
            <Button
              mini
              className="flat-btn"
              onClick={this.props.onChangePage.bind(this, Number(page) - 1)}
              disabled={page <= 1}
              icon="keyboard_arrow_left"/>
            <Button
              mini
              className="flat-btn"
              onClick={this.props.onChangePage.bind(this, Number(page) + 1)}
              disabled={page >= Math.ceil(this.props.count / perPage)}
              icon="keyboard_arrow_right"/>
          </Navigation>) : null}
        <Table
          model={model}
          selectable={this.props.selectable || false}
          multiSelectable={false}
          source={this.props.rows}
          theme={this.props.theme}
        />
      </div>
    );
  }

};