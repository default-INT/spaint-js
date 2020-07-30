import SpaintCompositeComponentWrapper, {SpaintReconciler} from "./spaint-composite-component-wrapper";

/**
 * Move component on level up. Need for default DOM-element. The transform them in component.
 * @param props
 * @constructor
 */
const TopLevelWrapper = function (props) {
    this.props = props;
}

TopLevelWrapper.prototype.render = function () {
    return this.props;
}

const Spaint = {
    /**
     * Create user component
     *
     * @param spec
     * @returns {Constructor}
     */
    createClass(spec) {
        function Constructor(props) {
            this.props = props;
            this.state = "undefined str";
        }
        // user method in life cycle (so how componentDidMount, componentWillMount ...)
        Constructor.prototype =
            Object.assign(Constructor.prototype, spec);

        return Constructor;
    },

    /**
     * Create and return SpaintComponent.
     * Examples:
     *  - <div>Text</div> = Spaint.createElement('div', null, 'Text');
     *  - <UserComponent message='Hello world' /> = Spaint.createElement(UserComponent, {message: 'Hello world'})
     *  - <UserComponent> <OtherUserComponent1 /> <OtherUserComponent2 /> </UserComponent>
     *          = Spaint.createElement(UserComponent, null, [
     *              Spaint.createElement(OtherUserComponent1),
     *              Spaint.createElement(OtherUserComponent2),
     *          ])
     *
     * @param type {function | string}
     * @param props {Object}
     * @param children {{type: *, props: (*|{})}[]}
     * @returns {{type: *, props: (*|{})}}
     */
    createElement(type, props, children) {
        const element = {
            type,
            props: props || {}
        };
        if (children) {
            element.props.children = children;
        }
        return element
    },

    /**
     * The render or render and update element in container.
     *
     * @param element
     * @param container
     * @returns {void|*}
     */
    render(element, container) {
        const prevComponent = getTopLevelComponentInContainer(container);
        if (prevComponent) {
            return updateRootComponent(prevComponent, element);
        } else {
            return renderNewRootComponent(element, container);
        }
    }
}

/**
 * If early root component did not have, then render new and append container.
 *
 * @param element
 * @param container
 * @returns {*}
 */
function renderNewRootComponent(element, container) {
    container.innerHTML = "";
    const wrapperElement = Spaint.createElement(TopLevelWrapper, element);
    const componentInstance = new SpaintCompositeComponentWrapper(wrapperElement);

    const markup = SpaintReconciler.mountComponent(componentInstance, container);

    container.__spaintComponentInstance = componentInstance._renderedComponent;

    return markup;
}

/**
 * Get rendered component from DOM-element.
 *
 * @param container
 * @returns {SpaintDOMComponent|SpaintCompositeComponentWrapper|undefined}
 */
function getTopLevelComponentInContainer(container) {
    return container.__spaintComponentInstance;
}

/**
 * The equals prev component and next component, and if component changes, update them.
 *
 * @param prevComponent
 * @param nextElement
 */
function updateRootComponent(prevComponent, nextElement) {
    SpaintReconciler.receiveComponent(prevComponent, nextElement);
}

export default Spaint