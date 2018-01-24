import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as Manifesto from 'manifesto.js';

class AnnotationDetail extends Component {
  static propTypes = {
    annotation: PropTypes.instanceOf(Manifesto.Annotation),
    onClose: PropTypes.func,
  };

  render() {
    const { annotation, onClose } = this.props;
    const resource = annotation.getResource();
    const bodies = annotation.getBody();

    if (bodies) {
      return (
        <div>
          {bodies.map((body, key) => {
            return (
              <div>
                {body.__jsonld.label ? <h1>{body.__jsonld.label}</h1> : null}
                <div
                  key={key}
                  dangerouslySetInnerHTML={{ __html: body.__jsonld.value }}
                />
              </div>
            );
          })}
        </div>
      );
    }

    if (resource && resource.getProperty('within')) {
      const toDisplay = resource.getProperty('within');
      return (
        <div>
          <h1>{toDisplay.label}</h1>
          <p>{toDisplay.description}</p>
          {onClose ? <button onClick={onClose}>close</button> : null}
        </div>
      );
    }

    return (
      <div>
        <h1>{annotation.getLabel()}</h1>
        <p>{annotation.getProperty('description')}</p>
        {onClose ? <button onClick={onClose}>close</button> : null}
      </div>
    );
  }
}

export default AnnotationDetail;
