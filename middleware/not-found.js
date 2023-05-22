const notFound = (req, res) => res.status(404).json({ Message: 'Route does not exist' })

module.exports = notFound
