import React, {PropTypes} from "react";
import {IconButton} from "react-toolbox/lib/button";

const _IconButton = ({href, ...props}, {router}) => {
  if (href) {
    props = {
      ...props, onClick: e => {
        e.preventDefault();
        return router.push(href)
      }, href: router.createHref(href)
    }
  }
  return <IconButton {...props} />
};

_IconButton.contextTypes = {
  router: PropTypes.object
};

_IconButton.propTypes = {
  href: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func])
};

export default _IconButton;