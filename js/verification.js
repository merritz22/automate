
/**
 * 
 * @param {String} alphabet 
 * @returns BigInt 
 */
function checkAlpha(alphabet) {
    if ((/([£a-zA-Z0-9]{1},[£a-zA-Z0-9]{1})/.test(alphabet)) || (/[£a-zA-Z0-9]{1}/.test(alphabet))) {
        let newAlph = []; tab = alphabet.split(",");
        tab.forEach(symbol => {
            if (newAlph.indexOf(symbol) == -1) {
                newAlph.push(symbol);
            }
        });
        return newAlph;
    }else{
        return -1;
    }
}

/**
 *
 * Verifie qu'une expression reguliere est bien
 * écrite
 *  
 * @param {String} regex 
 * @param {String} alphabet 
 * @returns Bool
 */
function checkRegex(regex, alphabet) {
    if (checkWithAlpha(regex, alphabet)) {
            if (checkParanthesis(regex)) {
                return true;
            }
    }
    return false;
}

/**
 * 
 * verifie un regex en fonction de l'alphabet
 * 
 * @param {String} regex 
 * @param {String} alphabet 
 * @returns Bool
 */
function checkWithAlpha(regex,alphabet) {
    alphas  = checkAlpha(alphabet);
    i = 0;
    if (alphas != -1) {
        alphas.push("+","*",".","(",")","£");
        regex = regex.split("");
        while ((i != regex.length) && (alphas.indexOf(regex[i]) != -1)) {
            i++;
        }
        if (i == regex.length) {
            return true;
        }else{
            return false;
        }
    }
    return false;
}

/**
 * 
 * verifie q'une expression reguliere est bien paranthésé
 * 
 * @param {String} regex 
 * @returns Bool
 */
function checkParanthesis(regex) {
    let reg = regex.split("");
    let ouvert = 0, fermer = 0;
    reg.forEach(elt => {
        if (elt == ")") {
            fermer +=1; 
        }else if(elt == "("){
            ouvert +=1;
        }
    });
    if (ouvert == fermer) {
        return true;
    }else{
        return false;
    }
}