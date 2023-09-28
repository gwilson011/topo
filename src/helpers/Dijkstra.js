class Node {
  constructor(val, priority) {
    this.val = val;
    this.priority = priority;
  }
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }
  //helper functions
  getLeftChildIndex(parentIdx) {
    return Math.floor(2 * parentIdx + 1);
  }
  getRightChildIndex(parentIdx) {
    return Math.floor(2 * parentIdx + 2);
  }
  getParentIndex(childIdx) {
    return Math.floor((childIdx - 1) / 2);
  }
  hasLeftChild(idx) {
    return this.getLeftChildIndex(idx) > this.values.length;
  }
  hasRightChild(idx) {
    return this.getRightChildIndex(idx) > this.values.length;
  }
  hasParent(idx) {
    return this.getParentIndex(idx) >= 0;
  }
  leftChild(idx) {
    return this.values[this.getLeftChildIndex(idx)];
  }
  rightChild(idx) {
    return this.values[this.getRightChildIndex(idx)];
  }
  parent(idx) {
    return this.values[this.getParentIndex(idx)];
  }
  swap(item1, item2) {
    let temp = this.values[item1];
    this.values[item1] = this.values[item2];
    this.values[item2] = temp;
  }

  enqueue(val, priority) {
    let newNode = new Node(val, priority);
    this.values.push(newNode);
    this.heapifyUp();
  }
  dequeue() {
    const item = this.values[0];
    if (this.values.length > 0) {
      this.values[0] = this.values.pop();
      this.heapifyDown();
    }
    return item;
  }
  heapifyUp() {
    let index = this.values.length - 1;
    const element = this.values[index];
    while (index > 0) {
      let parentIdx = this.getParentIndex(index);
      let parent = this.parent(index);
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[index] = parent;
      index = parentIdx;
    }
  }
  heapifyDown() {
    let index = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = this.getLeftChildIndex(index);
      let rightChildIdx = this.getRightChildIndex(index);
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.leftChild(index);
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.rightChild(index);
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[index] = this.values[swap];
      this.values[swap] = element;
      index = swap;
    }
  }
}

export class WeightedGraph {
  constructor(dist) {
    this.edgeList = {};
    this.inputDistance = dist;
  }
  setInputDistance(dist) {
    this.inputDistance = dist;
  }
  cleanEdges() {
    for (const property in this.edgeList) {
      if (this.edgeList[property].length === 0) delete this.edgeList[property];
    }
  }
  addVertex(vertex) {
    if (!this.edgeList[vertex]) this.edgeList[vertex] = [];
  }
  addEdge(vertex1, vertex2, weight, distance) {
    let exists = false;
    for (let i in this.edgeList[vertex1]) {
      if (this.edgeList[vertex1][i].node === vertex2) exists = true;
    }
    if (!exists) {
      this.edgeList[vertex1].push({ node: vertex2, weight, distance });
      this.edgeList[vertex2].push({ node: vertex1, weight, distance });
    }
  }
  modifiedDijsktra(start) {
    const nodes = new PriorityQueue();
    const elevations = {};
    const previous = {};
    let path = []; //to return at end
    let smallest;
    let distances = {};
    let done = false;
    let smallestDistance;

    //build up initial state
    for (let vertex in this.edgeList) {
      console.log(vertex, start);
      if (vertex === start) {
        elevations[vertex] = 0;
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        elevations[vertex] = Infinity;
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }
    console.log(elevations, previous);

    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;

      console.log(smallest);
      smallestDistance = distances[smallest];
      if (smallestDistance >= this.inputDistance) {
        // for (let i in distances) {
        //   console.log(distances[i], this.inputDistance);
        //   if (distances[i] >= this.inputDistance && distances[i] !== Infinity) {
        //     done = true; //todo: one more iteration
        //   }
        // }

        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || elevations[smallest] !== Infinity) {
        console.log("elevations:", elevations);
        console.log("previous:", previous);
        for (let neighbor in this.edgeList[smallest]) {
          //find neighboring node
          let nextNode = this.edgeList[smallest][neighbor];
          //see if node will exceed the distance parameter
          // if (smallestDistance + nextNode.distance > this.inputDistance) {
          //   done = true;
          //   continue;
          // }
          //calculate new distance to neighboring node
          let candidate = elevations[smallest] + nextNode.weight;
          let nextNeighbor = nextNode.node;
          if (candidate < elevations[nextNeighbor]) {
            console.log("smaller path detected...");
            //updating new smallest distance to neighbor
            elevations[nextNeighbor] = candidate;
            distances[nextNeighbor] = distances[smallest] + nextNode.distance;
            //updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest;
            //enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }
    return path.concat(smallest).reverse();
  }
}

export const testAlg = async (intersections) => {
  var graph = new WeightedGraph();
  graph.setInputDistance(12);
  graph.addVertex("A");
  graph.addVertex("B");
  graph.addVertex("C");
  graph.addVertex("D");
  graph.addVertex("E");
  graph.addVertex("F");

  graph.addEdge("A", "B", 4, 3);
  graph.addEdge("A", "C", 2, 1);
  graph.addEdge("B", "E", 3, 5);
  graph.addEdge("C", "D", 2, 6);
  graph.addEdge("C", "F", 4, 1);
  graph.addEdge("D", "E", 3, 4);
  graph.addEdge("D", "F", 1, 3);
  graph.addEdge("E", "F", 1, 2);

  return graph.modifiedDijsktra("A");
  // (5) ['A', 'C', 'D', 'F', 'E']
};
