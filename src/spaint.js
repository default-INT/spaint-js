import SpaintCompositeComponentWrapper, {SpaintReconciler} from "./spaint-composite-component-wrapper";

const TopLevelWrapper = function (props) {
    this.props = props;
}

TopLevelWrapper.prototype.render = function () {
    return this.props;
}

const Spaint = {
    createClass(spec) {
        function Constructor(props) {
            this.props = props;
            this.state = "undefined str";
        }
        Constructor.prototype.render = spec.render;

        return Constructor;
    },

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

    render(element, container) {
        container.innerHTML = "";
        const wrapperElement = this.createElement(TopLevelWrapper, element);
        const componentInstance = new SpaintCompositeComponentWrapper(wrapperElement);

        return SpaintReconciler.mountComponent(componentInstance, container);
    }
}

export default Spaint