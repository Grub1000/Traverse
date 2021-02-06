import React from 'react'
import './App.css';
import Node from './Node.js'
import { dijkstra, shortestPath } from './Dijkstra.js'

const gridX = 50;
const gridY = 50;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      startNode: {
        in: false,
        x: null,
        y: null
      },
      endNode: {
        in: false,
        x: null,
        y: null
      },
      mousePressed: false,
      step: 0,
      reset: true,
    };
    this.handleDijkstra = this.handleDijkstra.bind(this);
    this.animDijkstra = this.animDijkstra.bind(this);
    this.animShortestPath = this.animShortestPath.bind(this);
    this.handleMouseDownGeneral = this.handleMouseDownGeneral.bind(this);
    this.handleMouseEnterWall = this.handleMouseEnterWall.bind(this);
    this.handleMouseUpWall = this.handleMouseUpWall.bind(this);
  };
  componentDidMount() {
    let gridList = [];
    for (let x = 0; x < gridX; x++) {
      let tempList = [];
      for (let y = 0; y < gridY; y++) {
        const activeNode = {
          x: x,
          y: y,
          startNode: { in: false, x: null, y: null },
          endNode: { in: false, x: null, y: null },
          distance: Infinity,
          visited: false,
          wall: false,
          previousNode: null
        };
        tempList.push(activeNode)
      }
      gridList.push(tempList)
    }
    this.setState({ grid: gridList })
    return gridList
  }
  animDijkstra(orderedNodes, orderedShortestPathNodes) {
    for (let i = 0; i <= orderedNodes.length; i++) {
      if (i === orderedNodes.length) {
        setTimeout(() => {
          if (this.state.reset === false) {
            this.animShortestPath(orderedShortestPathNodes);
          }
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = orderedNodes[i];
        document.getElementById(`Node-${node.x}-${node.y}`).className =
          'NodeWrapper NodeVisited';
      }, 10 * i);
    }
  }
  animShortestPath(orderedShortestPathNodes) {
    for (let i = 0; i < orderedShortestPathNodes.length; i++) {
      setTimeout(() => {
        const node = orderedShortestPathNodes[i];
        document.getElementById(`Node-${node.x}-${node.y}`).className =
          'NodeWrapper NodeShortest';
      }, 10 * i)

    }
    this.setState({
      reset: true
    })
    document.getElementById(`ResetPointer`).className =
      'fas fa-spinner ResetBoardButton Pointer';
  }
  handleDijkstra() {
    document.getElementById(`ResetPointer`).className =
      'fas fa-spinner ResetBoardButton';
    if (this.state.step === 2) {
      const { grid } = this.state
      const startNode = grid[this.state.startNode.x][this.state.startNode.y]
      const endNode = grid[this.state.endNode.x][this.state.endNode.y]
      const orderedNodes = dijkstra(this.state.grid, startNode, endNode)
      const orderedShortestPathNodes = shortestPath(endNode)
      this.setState({
        step: 3,
        reset: false
      })
      this.animDijkstra(orderedNodes, orderedShortestPathNodes)
    }
  }
  handleMouseDownGeneral(x, y) {
    if (this.state.step === 0) {
      const newGrid = this.handleStartNode(this.state.grid, x, y);
      const newStep = this.state.step + 1
      this.setState({
        grid: newGrid,
        startNode: { in: true, x: x, y: y },
        step: newStep,
      })
    }
    if (this.state.step === 1) {
      const newGrid = this.handleEndNode(this.state.grid, x, y);
      const newStep = this.state.step + 1
      this.setState({
        grid: newGrid,
        endNode: { in: true, x: x, y: y },
        step: newStep
      })
    }
    if (this.state.step == 2) {
      const newGrid = this.handleToggleWalls(this.state.grid, x, y);
      this.setState({
        grid: newGrid,
        mousePressed: true,
      })
    }
  }
  handleMouseEnterWall(x, y) {
    if (!this.state.mousePressed) {
      return;
    }
    const newGrid = this.handleToggleWalls(this.state.grid, x, y);
    this.setState({
      grid: newGrid,
    })
  }
  handleMouseUpWall() {
    this.setState({
      mousePressed: false
    });
  }
  handleStartNode(grid, x, y) {
    const newGrid = grid.slice();
    const clickedNode = newGrid[x][y];
    const toggledNode = {
      ...clickedNode,
      startNode: { in: true, x: x, y: y }
    };
    newGrid[x][y] = toggledNode;
    return newGrid;
  }
  handleEndNode(grid, x, y) {
    const newGrid = grid.slice();
    const clickedNode = newGrid[x][y];
    const toggledNode = {
      ...clickedNode,
      endNode: { in: true, x: x, y: y }
    };
    newGrid[x][y] = toggledNode;
    return newGrid;
  }

  handleToggleWalls(grid, x, y) {
    const newGrid = grid.slice();
    const clickedNode = newGrid[x][y];
    const toggledNode = {
      ...clickedNode,
      wall: !clickedNode.wall,
    };
    newGrid[x][y] = toggledNode;
    return newGrid;
  }
  clearBoard() {
    if (this.state.reset === true) {
      let gridList = [];
      for (let x = 0; x < gridX; x++) {
        let tempList = [];
        for (let y = 0; y < gridY; y++) {
          const activeNode = {
            x: x,
            y: y,
            startNode: { in: false, x: null, y: null },
            endNode: { in: false, x: null, y: null },
            distance: Infinity,
            visited: false,
            wall: false,
            previousNode: null
          };
          tempList.push(activeNode)
          document.getElementById(`Node-${x}-${y}`).className =
            'NodeWrapper';
        }
        gridList.push(tempList)
      }
      this.setState({ grid: gridList, step: 0, })
      return gridList
    }
  }
  render() {
    let { grid } = this.state;
    const self = this;
    return (
      <div>
        <div className="DijkstraButton" onClick={() => self.handleDijkstra()}>Dijkstra</div>
        <div class="ResetBoardButtonWrapper"><i id="ResetPointer" class="fas fa-spinner ResetBoardButton Pointer" onClick={() => self.clearBoard()}></i></div>
        <div className="GridWrapper">{grid.map((x, xIndex) => {
          return <div key={xIndex}>
            {x.map((y, yIndex) =>
              <Node
                key={yIndex}
                startNode={y.startNode}
                endNode={y.endNode}
                x={y.x}
                y={y.y}
                wall={y.wall}
                handleMouseDownGeneral={this.handleMouseDownGeneral}
                handleMouseEnterWall={this.handleMouseEnterWall}
                handleMouseUpWall={this.handleMouseUpWall}
              />)}
          </div>
        })}</div>
        <div className="Rules">1. First Click = Start Node</div>
        <div className="Rules">2. Second Click = End Node</div>
        <div className="Rules">3. Click or Drag for Barriers</div>
        <div className="Rules">4. Start Algorithm of choice</div>
        <div className="Rules">More traversal algorithms coming soon...</div>
      </div>
    )
  }
}