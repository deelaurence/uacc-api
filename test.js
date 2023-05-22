const { indexOf } = require("lodash")

const ino = 'data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAAjUAAAKXCAYAAAB6wbt9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADs'
const position = ino.indexOf(',')
const extract = ino.slice(position + 1)
console.log(extract);