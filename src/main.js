import Spaint from "./spaint";

const Title = Spaint.createElement("h1", null, "InnerTitle");

const Header = Spaint.createClass({
    componentWillMount() {
        // setInterval(() => console.log('componentWillMount'), 1000);

    },

    render() {
        console.log(this.state);
        return Spaint.createElement('header', null, this.props.children);
    }
});

Spaint.render(
    Spaint.createElement(Header, null, [Title, Title, Title]), document.getElementById("root")
);

setTimeout(function () {
    const InnerTitle = Spaint.createClass({
        render() {
            return Spaint.createElement("h1", null, "Tether")
        }
    });

    Spaint.render(
        Spaint.createElement(Header, null, [Spaint.createElement(InnerTitle), Spaint.createElement(InnerTitle)]),
        document.getElementById("root")
    );
}, 2000);
