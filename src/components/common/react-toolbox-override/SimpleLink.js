import React, {PropTypes} from "react";

const A = ({href, ...props}, {router}) => {
  if (href) {
    props = {
      ...props, onClick: e => {
        e.preventDefault();
        return router.push(href);
      }, href: router.createHref(href)
    }
  }
  return <a {...props} />
};

A.contextTypes = {
  router: PropTypes.object
};

A.propTypes = {
  href: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func])
};

export default A;