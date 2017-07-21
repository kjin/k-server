const kAnnotations = Symbol('annotations')

Function.prototype.annotate = function annotate(annotations) {
  this[kAnnotations] = this[kAnnotations] || []
  if (typeof annotations === 'string') {
    this[kAnnotations].push(annotations)
  } else {
    Array.prototype.push.apply(this, annotations)
  }
  return this
}

Function.prototype.getAnnotations = function getAnnotations() {
  return this[kAnnotations] || []
}
