import SpaintDOMComponent from "./spaint-dom-component";


function instantiateSpaintComponent(element) {
    if (typeof element.type === 'string') {
        return new SpaintDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new SpaintCompositeComponentWrapper(element);
    }
}

export const SpaintReconciler = {
    mountComponent(internalInstance, container) {
        return internalInstance.mountComponent(container);
    }
};

export default class SpaintCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    setState(option) {
        this._currentElement.setState = () => console.log("state");
    }

    mountComponent(container) {
        const Component = this._currentElement.type;
        const componentInstance = new Component(this._currentElement.props);
        this._instance = componentInstance;

        if (!this._currentElement.initialState) {
            this._currentElement.initialState = {}
        }

        if (componentInstance.componentWillMount) {
            componentInstance.componentWillMount();
        }

        const markup = this.performInitialMount(container);

        if (componentInstance.componentDidMount) {
            componentInstance.componentDidMount();
        }

        return markup;
    }

    performInitialMount(container) {
        const renderedElement = this._instance.render();

        const child = instantiateSpaintComponent(renderedElement);

        this._renderedComponent = child;

        return SpaintReconciler.mountComponent(child, container);
    }
}