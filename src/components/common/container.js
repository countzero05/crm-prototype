import React, {Component, PropTypes} from "react";
import {Layout, Panel, AppBar/*, IconButton*/} from "react-toolbox";
import IconButton from "./../common/react-toolbox-override/IconButton";
import Header from "./header";
import style from "./../../static/stylesheets/style.scss";
import ProgressBar from "./../common/progressBar";

export default (WrappedComponent, createElements) =>
  ({title = "", className = "cardFormSection"}) =>
    class Container extends Component {

      static propTypes = {
        location: PropTypes.object
      };

      static contextTypes = {
        router: PropTypes.object
      };

      constructor(props) {
        super(props);

        this.state = {
          showHeader: false,
          actions: null,
        }
      }

      toggleMenu = () => this.setState({showHeader: !this.state.showHeader});

      setActions = (actions) => this.setState({actions});

      shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState || nextProps.location !== this.props.location;
      }

      render() {
        return (
          <Layout>
            <Header
              active={this.state.showHeader}
              toggle={this.toggleMenu}
            />
            <Panel scrollY={false} className={style[className]}>
              <AppBar
                leftIcon="menu"
                onLeftIconClick={ this.toggleMenu }
                title={title || "Checker"}
                fixed={false}
              >
                {createElements ? createElements(this.props, this.context) : null}
                {this.state.actions === null ? null : this.state.actions.constructor.name === "Object" ? Object.keys(this.state.actions).map(key => {
                    const act = {
                      ...this.state.actions[key],
                      inverse: true,
                    };
                    return (<IconButton key={key} {...act} />);
                  }
                ) : this.state.actions.constructor.name === "Function" ? this.state.actions(this.props, this.context) : this.state.actions}
              </AppBar>
              <ProgressBar />
              <div style={{flex: 1, overflowY: "auto"}}>
                <WrappedComponent {...{setActions: this.setActions, ...this.props}}/>
              </div>
            </Panel>
          </Layout>
        );
      }
    };
