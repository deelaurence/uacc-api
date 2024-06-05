const readMinutes = (paragraphOne,paragraphTwo,paragraphThree)=>{
    let readMinutes;
    function countWords(str) {
        return str.trim().split(/\s+/).length;
    }
    let wordsCount = countWords(paragraphOne)
    if (paragraphTwo) {
        wordsCount = wordsCount + countWords(paragraphTwo)
    }
    if (paragraphThree) {
        wordsCount = wordsCount + countWords(paragraphThree)
    }


    if (Math.round(wordsCount / 60) == 0 || Math.round(wordsCount / 60) == 1) {
        readMinutes = `One minute read`
    }
    else if (Math.round(wordsCount / 60) == 2) {
        readMinutes = `Two minutes read`
    }
    else {
        readMinutes = `${Math.round(wordsCount / 60)} minutes read`
    }
    return readMinutes;
}

module.exports = {readMinutes}