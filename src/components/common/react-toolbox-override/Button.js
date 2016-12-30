import React, {PropTypes} from "react";
import {Button} from "react-toolbox/lib/button";

const _Button = ({href, ...props}, {router}) => {
  if (href) {
    props = {
      ...props, onClick: e => {
        e.preventDefault();
        return router.push(href)
      }, href: router.createHref(href)
    }
  }
  return <Button {...props} />
};

_Button.contextTypes = {
  router: PropTypes.object
};

_Button.propTypes = {
  href: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func])
};

export default _Button;