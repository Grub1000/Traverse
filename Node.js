import React from 'react'
import './Node.css'

export default class Node extends React.Component {
    constructor() {
        super();
        this.state = {};
    };
    render() {
        let self = this;
        const definingClass = this.props.startNode.in ? "StartNode" : this.props.endNode.in ? "EndNode" : this.props.wall ? "Wall" : ""
        return (
            <div id={`Node-${this.props.x}-${this.props.y}`} className={`NodeWrapper ${definingClass}`}
                onMouseDown={() => {
                    self.props.handleMouseDownGeneral(self.props.x, self.props.y);
                }} onMouseUp={() => {
                    self.props.handleMouseUpWall();
                }} onMouseEnter={() => {
                    self.props.handleMouseEnterWall(this.props.x, self.props.y);
                }}></div>
        )
    }
}