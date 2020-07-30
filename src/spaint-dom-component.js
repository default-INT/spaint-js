import {instantiateSpaintComponent} from "./spaint-composite-component-wrapper";
import Spaint from "./spaint";

class SpaintDOMComponent {
    constructor(element) {
        this._currentElement = element;
    }

    receiveComponent(nextElement) {
        const prevElement = this._currentElement;
        this.updateComponent(prevElement, nextElement);
    }

    updateComponent(prevElement, nextElement) {
        const lastProps = prevElement.props;
        const nextProps = nextElement.props;

        if (prevElement.props.children.length !== nextElement.props.children.length) {
            this.unmountComponent();
            const spaintComponent = instantiateSpaintComponent(nextElement);
            spaintComponent.mountComponent(this._hostNode.parentElement);
        }

        this._updateDOMProperties(lastProps, nextProps);
        this._updateDOMChildren(lastProps, nextProps);

        this._currentElement = nextElement;
    }

    _updateDOMProperties(lastProps, nextProps) {
        // nothing to do! I'll explain why below
    }

    _updateDOMChildren(lastProps, nextProps) {
        const lastContent = lastProps.children;
        const nextContent = nextProps.children;

        if (!nextContent) {
            this.updateTextContent('');
        } else if (lastContent !== nextContent) {
            //nextContent.mountComponent(this._hostNode.parentElement);
            //this.updateTextContent('' + nextContent);
        }
    }

    updateTextContent(text) {
        const node = this._hostNode;

        const firstChild = node.firstChild;

        if (firstChild && firstChild === node.lastChild
            && firstChild.nodeType === 3) {
            firstChild.nodeValue = text;
            return;
        }

        node.textContent = text;
    }

    mountComponent(container) {
        const domElement = document.createElement(this._currentElement.type);

        const child = this._currentElement.props.children;

        if (child instanceof Array) {
            const elements = child.map(e => instantiateSpaintComponent(e));
            elements.forEach(e => e.mountComponent(domElement));
        } else if (typeof child === 'string') {
            const textNode = document.createTextNode(child);
            domElement.appendChild(textNode);
        } else {
            const element = instantiateSpaintComponent(Spaint.createElement(child));
            element.mountComponent(domElement)
        }

        container.appendChild(domElement);

        this._hostNode = domElement;
        return domElement;
    }

    unmountComponent() {
        this._hostNode.innerHTML = '';
    }
}

export default SpaintDOMComponent;