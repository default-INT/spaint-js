import Spaint, {node} from "./spaint";

const Title = node({
    type: 'h1',
    content: 'InnerTitle'
})

const Header = Spaint.createClass({
    componentWillMount() {
        // setInterval(() => console.log('componentWillMount'), 1000);

    },

    render() {
        console.log(this.state);
        return node({
            type: 'header',
            content: this.props.children
        });
    }
});

Spaint.render(
    node({
        type: Header,
        content: ['Text', Title, Title]
    }), document.getElementById("root")
);

setTimeout(function () {
    const InnerTitle = Spaint.createClass({
        render() {
            return node({
                type: 'h1',
                content: 'Theater'
            })
        }
    });

    Spaint.render(
        node({
            type: Header,
            content: ['Text', Title, Title]
        }),
        document.getElementById("root")
    );
}, 2000);
