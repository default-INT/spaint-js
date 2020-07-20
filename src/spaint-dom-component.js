class SpaintDOMComponent {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const domElement = document.createElement(this._currentElement.type);

        const child = this._currentElement.props.children;

        if (child instanceof Array) {
            const elements = child.map(e => new SpaintDOMComponent(e));
            elements.forEach(e => e.mountComponent(domElement));
        } else if (typeof child === 'string') {
            const textNode = document.createTextNode(child);
            domElement.appendChild(textNode);
        } else {
            const element = new SpaintDOMComponent(child);
            element.mountComponent(domElement)
        }

        container.appendChild(domElement);

        this._hostNode = domElement;
        return domElement;
    }
}

export default SpaintDOMComponent;