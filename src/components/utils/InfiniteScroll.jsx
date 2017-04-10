/**
 * An infinite scroll component for React
 * https://github.com/guillaumervls/react-infinite-scroll
 */
import React, { Component, PropTypes } from 'react';

class InfiniteScroll extends React.Component {
  static propTypes = {
    /**
     * Name of the element that the component should render as.
     */
    element: PropTypes.string,

    /**
     * Whether there are more items to be loaded. Event listeners are removed if false.
     */
    hasMore: PropTypes.bool,

    /**
     * Whether new items should be loaded when user scrolls to the top of the scrollable area.
     */
    isReverse: PropTypes.bool,

    /**
     * A callback when more items are requested by the user.
     */
    loadMore: PropTypes.func.isRequired,

    /**
     * The number of the first page to load, With the default of 0, the first page is 1.
     */
    pageStart: PropTypes.number,

    /**
     * The distance in pixels before the end of the items that will trigger a call to loadMore.
     */
    threshold: PropTypes.number,

    /**
     * Proxy to the useCapture option of the added event listeners.
     */
    useCapture: PropTypes.bool,

    /**
     * Add scroll listeners to the window, or else, the component's parentNode.
     */
    useWindow: PropTypes.bool,
  };

  static defaultProps = {
    element: 'div',
    hasMore: false,
    pageStart: 0,
    threshold: 0,
    useWindow: true,
    isReverse: false,
    useCapture: false,
  };

  constructor(props) {
    super(props);

    this.scrollListener = this.scrollListener.bind(this);
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();
    this.scrollListener();
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  render() {
    const {
      children,
      element,
      hasMore,
      isReverse,
      loader,
      loadMore,
      pageStart,
      threshold,
      useCapture,
      useWindow,
      ...props
      } = this.props;

    props.ref = (node) => {
      this.scrollComponent = node;
    };

    return React.createElement(element, props, children, hasMore && (loader || this._defaultLoader));
  }

  calculateTopPosition(el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  scrollListener() {
    const el = this.scrollComponent;
    const scrollEl = window;

    let offset;
    if (this.props.useWindow) {
      var scrollTop = (scrollEl.pageYOffset !== undefined) ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      if (this.props.isReverse)
        offset = scrollTop;
      else
        offset = this.calculateTopPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
    } else {
      if (this.props.isReverse)
        offset = el.parentNode.scrollTop;
      else
        offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
    }

    if (offset <= Number(this.props.threshold)) {
      this.detachScrollListener();
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof this.props.loadMore == 'function') {
        this.props.loadMore(this.pageLoaded += 1);
      }
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore) {
      return;
    }

    let scrollEl = window;
    if (this.props.useWindow == false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.addEventListener('scroll', this.scrollListener, this.props.useCapture);
    scrollEl.addEventListener('resize', this.scrollListener, this.props.useCapture);
  }

  detachScrollListener() {
    var scrollEl = window;
    if (this.props.useWindow == false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.removeEventListener('scroll', this.scrollListener, this.props.useCapture);
    scrollEl.removeEventListener('resize', this.scrollListener, this.props.useCapture);
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  // Set a defaut loader for all your `InfiniteScroll` components
  setDefaultLoader(loader) {
    this._defaultLoader = loader;
  }
}


export default InfiniteScroll;