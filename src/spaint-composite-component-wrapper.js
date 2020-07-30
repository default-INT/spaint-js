import SpaintDOMComponent from "./spaint-dom-component";


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

    receiveComponent(nextElement) {
        const prevElement = this._currentElement;
        this.updateComponent(prevElement, nextElement);
    }

    updateComponent(prevElement, nextElement) {
        const nextProps = nextElement.props;
        const inst = this._instance;

        if (inst.componentWillReceiveProps) {
            inst.componentWillReceiveProps(nextProps);
        }

        let shouldUpdate = true;

        if (inst.shouldComponentUpdate) {
            shouldUpdate = inst.shouldComponentUpdate(nextProps);
        }

        if (shouldUpdate) {
            this._performComponentUpdate(nextElement, nextProps);
        } else {
            // if skipping the update,
            // still need to set the latest props
            inst.props = nextProps;
        }
    }

    _performComponentUpdate(nextElement, nextProps) {
        this._currentElement = nextElement;
        const inst = this._instance;

        inst.props = nextProps;

        this._updateRenderedComponent();
    }

    _updateRenderedComponent() {
        const prevComponentInstance = this._renderedComponent;
        const inst = this._instance;
        const nextRenderedElement = inst.render();

        SpaintReconciler.receiveComponent(prevComponentInstance, nextRenderedElement);
    }
}

export function instantiateSpaintComponent(element) {
    if (typeof element.type === 'string') {
        return new SpaintDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new SpaintCompositeComponentWrapper(element);
    }
}

export const SpaintReconciler = {
    mountComponent(internalInstance, container) {
        return internalInstance.mountComponent(container);
    },

    receiveComponent(internalInstance, nextElement) {
        internalInstance.receiveComponent(nextElement);
    }
};