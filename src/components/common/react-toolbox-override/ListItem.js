import React, {PropTypes} from "react";
import {ListItem} from "react-toolbox/lib/list";

const _ListItem = ({to, onClick, ...props}, {router}) => {
  if (to) {
    props = {
      ...props, onClick: e => {
        e.preventDefault();
        router.push(router.createHref(to));
        return onClick !== undefined ? onClick(e) : true;
      }, to: router.createHref(to)
    }
  }

  props = {...props, selectable: true};
  return <ListItem {...props} />
};

_ListItem.contextTypes = {
  router: PropTypes.object
};

_ListItem.propTypes = {
  to: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  onClick: PropTypes.func
};

export default _ListItem;