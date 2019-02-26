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

    let isOnlyElements = [];
    for (let i = 0; i < emptyElements.length; i++) {
        if (emptyElements[i].isOnlyElement === 1) {
            isOnlyElements.push(emptyElements[i]);
        }
    }
    for (let i = 0; i < emptyElements.length; i++) {
        for (let k = 0; k < isOnlyElements.length; k++) {
            if ((emptyElements[i].row === isOnlyElements[k].row || emptyElements[i].col === isOnlyElements[k].col || emptyElements[i].box === isOnlyElements[k].box) && emptyElements[i].index !== isOnlyElements[k].index && emptyElements[i].possibleVariants.indexOf(emptyElements[k].currentValue) >= 0) {
                emptyElements[i].possibleVariants.splice(emptyElements[i].possibleVariants.indexOf(isOnlyElements[k].currentValue), 1);
            }
        }
    }

    for (let i = 0; i < emptyElements.length; i++) {
        if (emptyElements[i].possibleVariants.length === 1 && emptyElements[i].isOnlyElement !== 1) {
            emptyElements[i].currentValue = emptyElements[i].possibleVariants[0];
        }
    }


    //let singleEntries = findSingleEntries(emptyElements);
    let array = currentValueSearch(emptyElements, 0);


    for (let i = 0; i < array.length; i++) {
        let col = array[i].col;
        let row = array[i].row;
        let value = array[i].currentValue
        matrix[row][col] = value;
    }



    return matrix;
}

function findSingleEntries(array1) {
    let array = [];

    for (let i = 0; i < array1.length; i++) {
        array.push(array1[i]);
    }
    let flag = 0;
    for (let i = 0; i < array.length; i++) {
        flag = 0;
        for (let j = 0; j < array.length; j++) {
            for (let index = 0; index < array[i].possibleVariants.length; index++) {
                if ((array[i].col === array[j].col || array[i].row === array[j].row || array[i].box === array[j].box) && i !== j && array[j].possibleVariants.indexOf(array[i].possibleVariants[index]) > -1) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 1) {
                break;
            }
        }
        if (flag === 0) {
            array[i].currentValue = array[i].possibleVariants[index];
        }
    }
    return array;
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

function currentValueSearch(array1, index) {

    let array = [];

    for (let i = 0; i < array1.length; i++) {
        array.push(array1[i]);
    }



    if (array[index].isOnlyElement === 1) {
        if (index === array.length - 1) {
            return array;
        }
        currentValueSearch(array, index + 1);
        let count = 0;
        for (let n = 0; n < array.length; n++) {
            if (array[n].currentValue !== 0) {
                count++;
            }
        }

        if (count === array.length) {
            return array;
        }

    }
    if (array[index].currentValue === 0) {
        if (checkElements(array, index, array[index].possibleVariants[0]) == true) {
            array[index].currentValue = array[index].possibleVariants[0];
            if (index === array.length - 1) {
                return array;
            } else {
                currentValueSearch(array, index + 1);
                count = 0;
                for (let n = 0; n < array.length; n++) {
                    if (array[n].currentValue !== 0) {
                        count++;
                    }
                }

                if (count === array.length) {
                    return array;
                }

            }
        } else {
            for (let j = 1; j < array[index].possibleVariants.length; j++) {

                if (checkElements(array, index, array[index].possibleVariants[j]) == true) {
                    array[index].currentValue = array[index].possibleVariants[j];
                    if (index === array.length - 1) {
                        return array;
                    } else {
                        currentValueSearch(array, index + 1);
                        count = 0;
                        for (let n = 0; n < array.length; n++) {
                            if (array[n].currentValue !== 0) {
                                count++;
                            }
                        }

                        if (count === array.length) {
                            return array;
                        }

                    }
                } else {
                    if (j === array[index].possibleVariants.length - 1) {
                        array[index].currentValue = 0;
                        currentValueSearch(array, index - 1);
                        count = 0;
                        for (let n = 0; n < array.length; n++) {
                            if (array[n].currentValue !== 0) {
                                count++;
                            }
                        }

                        if (count === array.length) {
                            return array;
                        }

                    } else {
                        continue;
                    }
                }
            }
        }

    } else {
        if (array[index].possibleVariants.indexOf(array[index].currentValue) === array[index].possibleVariants.length - 1) {
            array[index].currentValue = 0;
            currentValueSearch(array, index - 1);
            count = 0;
            for (let n = 0; n < array.length; n++) {
                if (array[n].currentValue !== 0) {
                    count++;
                }
            }

            if (count === array.length) {
                return array;
            }

        } else {


            for (let j = array[index].possibleVariants.indexOf(array[index].currentValue) + 1; j < array[index].possibleVariants.length; j++) {
                if (checkElements(array, index, array[index].possibleVariants[j]) == true) {
                    array[index].currentValue = array[index].possibleVariants[j];
                    if (index === array.length - 1) {
                        return array;
                    } else {
                        currentValueSearch(array, index + 1);
                        count = 0;
                        for (let n = 0; n < array.length; n++) {
                            if (array[n].currentValue !== 0) {
                                count++;
                            }
                        }

                        if (count === array.length) {
                            return array;
                        }

                    }
                } else {
                    if (j === array[index].possibleVariants.length - 1) {
                        array[index].currentValue = 0;
                        currentValueSearch(array, index - 1);
                        count = 0;
                        for (let n = 0; n < array.length; n++) {
                            if (array[n].currentValue !== 0) {
                                count++;
                            }
                        }

                        if (count === array.length) {
                            return array;
                        }

                    } else {
                        continue;
                    }
                }
            }

        }
    }

}
/*const initial = [
    [5, 3, 4, 6, 7, 8, 9, 0, 0],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];
solveSudoku(initial);*/