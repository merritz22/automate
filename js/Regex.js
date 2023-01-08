// Ici on va ecerire toute les methode qui servent a la manipulation des regex dans le cadre de les transformées en AFN
class Regex{

    /**
     * 
     * Construction d'une expression reguliere a partir d'une chaine
     * 
     * @param {String} chaine 
     */
    constructor(chaine){
        this.reg = chaine.split("");
        this.postExp = [];
    }

    /**
     * 
     * Cette fonction retourne la forme postfixe d'une expression reguliere
     * 
     * @param {String} string 
     * @param {Array} pile 
     * @param {Array} postExp 
     * @returns Array
     */
    createPostExp(string, pile, postExp) {
        if ((string.length == 0) && (pile.length == 0)) {
          return postExp;
        } else if ((string.length == 0) && (pile.length != 0)) {
          let operator = pile.shift();
          postExp.push(operator);
          this.createPostExp(string, pile, postExp);
        } else if (string.length != 0) {
          if (string[0] == "(") {
            pile.unshift(string.shift());
            this.createPostExp(string, pile, postExp);
          } else if (string[0] == "*") {
            pile.unshift(string.shift());
            this.createPostExp(string, pile, postExp);
          } else if (string[0] == ".") {
            if ((pile[0] == "+") || (pile[0] == "(") ||(pile.length == 0)) {
              pile.unshift(string.shift());
              this.createPostExp(string, pile, postExp);
            } else if (pile[0] == "*") {
              while (pile[0] == "*") {
                postExp.push(pile.shift());
              }
              pile.unshift(string.shift());
              this.createPostExp(string, pile, postExp);
            } else {
              postExp.push(string.shift());
              this.createPostExp(string, pile, postExp);
            }
          } else if (string[0] == "+") {
            if (pile.length == 0 || (pile[0] != "*" && pile[0] != "+")) {
              pile.unshift(string.shift());
              this.createPostExp(string, pile, postExp);
            } else {
              postExp.push(string.shift());
              this.createPostExp(string, pile, postExp);
            }
          } else if (string[0] == ")") {
            string.shift();
            while (pile[0] != "(") {
              postExp.push(pile.shift());
            }
            pile.shift();
            this.createPostExp(string, pile, postExp);
          } else {
            postExp.push(string.shift());
            this.createPostExp(string, pile, postExp);
          }
        }
    }
}