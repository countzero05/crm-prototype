import React, {PropTypes} from "react";
import Link from "react-toolbox/lib/link";

const _Link = ({href, ...props}, {router}) => {
  if (href) {
    props = {
      ...props, onClick: e => {
        e.preventDefault();
        return router.push(href)
      }, href: router.createHref(href)
    }
  }
  return <Link {...props} />
};

_Link.contextTypes = {
  router: PropTypes.object
};

_Link.propTypes = {
  href: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func])
};

export default _Link;