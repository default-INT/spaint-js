import Spaint from "./spaint";

const Title = Spaint.createElement("h1", null, "Tether");

const Header = Spaint.createClass({
    render() {
        console.log(this.state);
        return Spaint.createElement('header', null, this.props.children);
    }
})

Spaint.render(
    Spaint.createElement(Header, null, [Title, Title, Title]), document.getElementById("root")
)