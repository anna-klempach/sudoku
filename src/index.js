module.exports = function solveSudoku(matrix) {
    let boxIndex = [
        { index: 0, row: 0, col: 0 },
        { index: 1, row: 0, col: 3 },
        { index: 2, row: 0, col: 6 },
        { index: 3, row: 3, col: 0 },
        { index: 4, row: 3, col: 3 },
        { index: 5, row: 3, col: 6 },
        { index: 6, row: 6, col: 0 },
        { index: 7, row: 6, col: 3 },
        { index: 8, row: 6, col: 6 }
    ];
    let emptyElements = sortMatrix(matrix, boxIndex);

    for (let i = 0; i < emptyElements.length - 1; i++) {
        for (let j = i + 1; j < emptyElements.length; j++) {
            if (emptyElements[i].possibleVariants.length > emptyElements[j].possibleVariants.length) {
                buffer = emptyElements[i];
                emptyElements[i] = emptyElements[j];
                emptyElements[j] = buffer;
            }
        }
    }

    let count = 0;
    while (emptyElements[count].isOnlyElement === 1 && count < emptyElements.length - 1) {
        count++;
    }
    if (count === emptyElements.length - 1 && emptyElements[count].isOnlyElement !== 1) {
        count--;
    }

    if (count < emptyElements.length - 1) {
        currentValueSearch(emptyElements, count);
    }

    for (let i = 0; i < emptyElements.length; i++) {
        let col = emptyElements[i].col;
        let row = emptyElements[i].row;
        let value = emptyElements[i].currentValue
        matrix[row][col] = value;
    }
    return matrix;
}

function sortMatrix(matrix, boxIndex) {
    let array = [];
    let count = 0;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (matrix[i][j] === 0) {
                array[count] = {};
                array[count].index = count;
                array[count].row = i;
                array[count].col = j;

                for (let k = 0; k < 9; k++) {
                    if (i >= boxIndex[k].row && i < boxIndex[k].row + 3 && j >= boxIndex[k].col && j < boxIndex[k].col + 3) {
                        array[count].box = boxIndex[k].index;
                    }
                }
                count++;
            }
        }
    }

    let found;
    let possibleVariantsElement;
    let row;
    let col;
    let colMin;
    let rowMin;

    for (let i = 0; i < array.length; i++) {
        possibleVariantsElement = [];
        row = array[i].row;
        col = array[i].col;
        box = array[i].box;
        rowMin = boxIndex[array[i].box].row;
        colMin = boxIndex[array[i].box].col;

        for (let j = 1; j <= 9; j++) {

            found = 0;
            //check in rows
            for (let k = 0; k < 9; k++) {
                if (matrix[row][k] === j) {
                    found = 1;
                }
            }
            //check in cols
            if (found === 0) {
                for (k = 0; k < 9; k++) {
                    if (matrix[k][col] === j) {
                        found = 1;
                    }
                }
            }
            //check in boxes
            if (found === 0) {
                for (k = rowMin; k < rowMin + 3; k++) {
                    for (let m = colMin; m < colMin + 3; m++) {
                        if (matrix[k][m] === j) {
                            found = 1;
                        }
                    }
                }
            }
            if (found === 0) {
                possibleVariantsElement.push(j);
            } else {
                continue;
            }
        }
        array[i].possibleVariants = [];
        for (let j = 0; j < possibleVariantsElement.length; j++) {

            let buffer = possibleVariantsElement[j];
            array[i].possibleVariants.push(buffer);
        }

        if (possibleVariantsElement.length === 1) {
            array[i].isOnlyElement = 1;
            array[i].currentValue = possibleVariantsElement[0];
        } else {
            array[i].isOnlyElement = 0;
            array[i].currentValue = 0;
        }
    }
    return array;
}

function checkElements(array, index, value) {
    for (let i = 0; i < array.length; i++) {

        if (array[i].row === array[index].row && array[i].currentValue === value) {
            return false;
        }

        if (array[i].col === array[index].col && array[i].currentValue === value) {
            return false;
        }

        if (array[i].box === array[index].box && array[i].currentValue === value) {
            return false;
        }
    }
    return true;
}


function currentValueSearch(array, index) {

    for (let j = 0; j < array[index].possibleVariants.length; j++) {
        if (checkElements(array, index, array[index].possibleVariants[j]) == true) {
            array[index].currentValue = array[index].possibleVariants[j];
            if (index === array.length - 1) {
                return array;
            } else {
                if (currentValueSearch(array, index + 1) == false) {
                    if (j < array[index].possibleVariants.length - 1) {
                        continue;
                    } else {
                        array[index].currentValue = 0;
                        return false;
                    }
                } else {
                    return array;
                }
            }
        } else {
            if (j === array[index].possibleVariants.length - 1) {
                array[index].currentValue = 0;
                return false;
            } else {
                continue;
            }
        }
    }
}