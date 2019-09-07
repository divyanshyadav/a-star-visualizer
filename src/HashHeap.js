import { Heap } from 'data-structures-again'

class HashHeap {
    constructor (comparator) {
        this.heap = new Heap(comparator)
        this.map = new Map()
    }

    push (item) {
        this.heap.push(item)
        this.map.set(item.getKey(), 1)
    }

    pop () {
        const item = this.heap.pop()
        if (item) {
            this.map.delete(item.getKey())
            return item
        }
    }

    has (key) {
        return this.map.has(key)
    }

    peek () {
        return this.heap.peek()
    }

    forEach (fn) {
        this.heap.forEach(fn)
    }

    get length () {
        return this.heap.length
    }
}

export default HashHeap
