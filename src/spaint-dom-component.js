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

        this._updateDOMProperties(lastProps, nextProps);
        this._updateDOMChildren(prevElement, nextElement);

        this._currentElement = nextElement;
    }

    _updateDOMProperties(lastProps, nextProps) {
        // nothing to do! I'll explain why below. TODO: Update CSS
    }

    _updateDOMChildren(prevElement, nextElement) {
        const lastContent = prevElement.props.children;
        const nextContent = nextElement.props.children;

        if (!nextContent) {
            this.updateTextContent('');
        } else if (JSON.stringify(lastContent) !== JSON.stringify(nextContent)) {   //TODO: use correct equals.
            //nextContent.mountComponent(this._hostNode.parentElement);
            //this.updateTextContent('' + nextContent);
            this.unmountComponent();
            const spaintComponent = instantiateSpaintComponent(nextElement);
            spaintComponent.mountComponent(this._hostNode.parentElement);
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