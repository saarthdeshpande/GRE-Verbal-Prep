const { CollegiateDictionary, LearnersDictionary, CollegiateThesaurus } = require('mw-dict')

const dict = new CollegiateDictionary(process.env.WEBSTER_API_KEY)

module.exports = dict