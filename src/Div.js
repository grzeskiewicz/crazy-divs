import React from 'react';
import './css/App.css';
const DEFAULT_HEIGHT = 300;
const DEFAULT_WIDTH = 300;

class Div extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mouseDown: false,
            draggable: true,
            cursor: '',
            corner: '',
            startResize: '',
            divStyles: {
                backgroundColor: this.props.color,
                position: 'absolute',
                left: window.innerWidth / 2 - 200,
                top: window.innerHeight / 2 - 200,
                height: DEFAULT_HEIGHT,
                width: DEFAULT_WIDTH,
                zIndex: 1,
            }
        }

        this.leftDiv = this.leftDiv.bind(this);
        this.clickedDiv = this.clickedDiv.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.toggleDraggable = this.toggleDraggable.bind(this);
        this.cursorDetector = this.cursorDetector.bind(this);
        this.outOfDiv = this.outOfDiv.bind(this);
        this.resizeKey = this.resizeKey.bind(this);
        this.resizeMouse = this.resizeMouse.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.dragStart = this.dragStart.bind(this);
    }

    componentDidMount() {
    }

    resizeKey(e) {
        const divStyles = this.state.divStyles;
        if (!this.state.draggable) {
            if (e.key === "ArrowLeft") {
                divStyles.width = divStyles.width - 50;
                this.setState({ divStyles: divStyles });
            }
            if (e.key === "ArrowRight") {
                divStyles.width = divStyles.width + 50;
                this.setState({ divStyles: divStyles });
            }


            if (e.key === "ArrowUp") {
                divStyles.height = divStyles.height - 50;
                this.setState({ divStyles: divStyles });
            }

            if (e.key === "ArrowDown") {
                divStyles.height = divStyles.height + 50;
                this.setState({ divStyles: divStyles });
            }
        }
    }

    mouseUp(e) {
        console.log('up')
        document.removeEventListener('mousemove', this.resizeMouse);
    }

    resizeMouse(e) {
        const divStyles = this.state.divStyles;
        if (this.state.mouseDown && this.state.cursor !== '') {
            document.addEventListener('mouseup', this.mouseUp);
            const startX = this.state.startResize.x;
            const startY = this.state.startResize.y;
            let distX = Math.abs(e.clientX - startX);
            let distY = Math.abs(e.clientY - startY);
            if (this.state.corner === 'ne') {
                if (e.clientX > startX) {
                    divStyles.top = divStyles.top - distY;
                } else if (e.clientX < startX) {
                    divStyles.top = divStyles.top + distY;
                    distX = -distX;
                    distY = -distY;
                }
            }

            if (this.state.corner === 'se') {
                if (e.clientX < startX) distX = -distX;
                if (e.clientY < startY) distY = -distY;
            }

            if (this.state.corner === 'sw') {
                if (e.clientX > startX) {
                    divStyles.left = divStyles.left + distX;
                    distX = -distX;
                    distY = -distY;
                } else if (e.clientX < startX) {
                    divStyles.left = divStyles.left - distX;

                }
            }
            divStyles.height = divStyles.height + distY;
            divStyles.width = divStyles.width + distX;

            this.setState({ divStyles: divStyles, startResize: { x: e.clientX, y: e.clientY } });
        }
    }

    clickedDiv(e) {
        const x = e.clientX;
        const y = e.clientY;
        if (this.state.draggable) {
            if (this.state.cursor === '') {
                this.setState({ mouseDown: true, start: { x: x, y: y } });
                this.props.setClickedDiv(this.props.id);
            } else {

            }
        } else {
            this.setState({ mouseDown: true, startResize: { x: x, y: y } });
            document.addEventListener('mousemove', this.resizeMouse);
            console.log("CORNER");
        }
    }

    outOfDiv(e) {
        // console.log(e.clientX, e.clientY);
    }

    leftDiv(e) {
        document.removeEventListener('mousemove', this.resizeMouse);
        this.setState({ mouseDown: false, startResize: '', start: '' });
    }

    toggleDraggable() {
        this.setState({ draggable: !this.state.draggable });
    }

    cursorDetector(e) {
        // console.log(this.props.id);
        const amISelected = this.props.selectedDiv === this.props.id;
        if (amISelected) {
            const x = this.state.divStyles.left;
            const y = this.state.divStyles.top;
            const width = this.state.divStyles.width;
            const height = this.state.divStyles.height;

            if ((x + width - e.clientX < 10) && (e.clientY - y < 10)) {
                this.setState({ cursor: 'nesw', corner: 'ne' });
            } else if ((e.clientX - x < 10) && (y + height - e.clientY < 10)) {
                this.setState({ cursor: 'nesw', corner: 'sw' });
            }
            else if ((x + width - e.clientX < 10) && (y + height - e.clientY < 10)) {
                this.setState({ cursor: 'nwse', corner: 'se' });
            } else {
                this.setState({ cursor: '', corner: '' });
            }
        }

    }


    dragEnd(e) {
        console.log("AAAAA")
        const width = this.state.divStyles.width;
        const height = this.state.divStyles.height;

        let distX = Math.abs(this.state.start.x - e.clientX);
        let distY = Math.abs(this.state.start.y - e.clientY);
        if (this.state.start.x > e.clientX) distX = -distX;
        if (this.state.start.y > e.clientY) distY = -distY

        const newPosX = this.state.divStyles.left + distX;
        const newPosY = this.state.divStyles.top + distY;

        const isDockedRight = newPosX + width > window.innerWidth - 100;
        const isDockedTop = newPosY < 100;
        const isDockedLeft = newPosX < 100;

        this.setState({
            mouseDown: false,
            divStyles: {
                backgroundColor: this.props.color,
                position: 'absolute',
                left: (isDockedTop) ? 0 :
                    (isDockedLeft ? 0 :
                        (isDockedRight ? window.innerWidth - 100 : newPosX)
                    ),
                top: (isDockedTop) ? 0 :
                    (isDockedLeft ? 0 :
                        (isDockedRight ? 0 : newPosY)),
                height: (isDockedTop) ? 100 :
                    ((isDockedLeft || isDockedRight) ? window.innerHeight : height),
                width: (isDockedTop) ? window.innerWidth :
                    ((isDockedLeft || isDockedRight) ? 100 : width),
                zIndex: 10,
                docked: isDockedLeft || isDockedRight || isDockedTop
            }
        });
    }

    dragStart(e) { //TODO: making this go to default size so it doesn't dock on the other side
        if (this.state.divStyles.docked) {
            //console.log("YEPS")
            const divStyles = this.state.divStyles;
            divStyles.width = DEFAULT_WIDTH;
            divStyles.height = DEFAULT_HEIGHT;
            //console.log(divStyles)
            this.setState({ divStyles: divStyles });
            //console.log(this.state.divStyles);
        }
    }



    render() {
        let style = JSON.parse(JSON.stringify(this.state.divStyles)); //deep copy
        const amISelected = this.props.selectedDiv === this.props.id;
        style.zIndex = amISelected ? 10 : 1;
        return (
            <div tabIndex="0" className={(this.state.mouseDown ? 'grabbed' : '') + (amISelected ? ' selected ' : '') + (this.state.cursor)} style={style} draggable={this.state.draggable}
                onMouseDown={this.clickedDiv} onMouseUp={this.leftDiv} onDragStart={this.dragStart}
                onDragEnd={this.dragEnd} onMouseMove={this.cursorDetector} onMouseOut={this.outOfDiv} onKeyDown={this.resizeKey}>
                <button onClick={this.toggleDraggable}>{this.state.draggable ? "Lock" : "Unlock"} </button>
            </div>
        );
    }

}
export default Div;