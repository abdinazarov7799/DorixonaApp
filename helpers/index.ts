export const numberWithSpaces = (x = 0) => {

    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : 0;

};
export const removeLetter = (letter='') => {
    if (letter.includes("(")) {
        return letter.slice(0, 26);
    } else if (letter.includes("Активлар")) {
        return letter.slice(54).charAt(0).toUpperCase() + letter.slice(55);
    } else {
        return letter;
    }
};

export const firstLetterName = (firstName="") => {
    if (["Ch", "Sh"].includes(firstName.slice(0, 2))) {
        return firstName.slice(0, 2);
    } else {
        return firstName.slice(0, 1);
    }
};
