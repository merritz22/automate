class AFN{


  /**
   * 
   * chaine qui represente l'expression reguliere
   * 
   * @param {String} alphas 
   */
  constructor(alphas){
      this.alphas = alphas.split(",");
      this.transitFunction = null;
      this.states = [];
      this.init = 0;
      this.final = null;
  }

  /**
   * 
   * Construction de l'automate de la repetition d'une expression
   * 
   * @param {Array} tab 
   * @param {Array} newPile 
   * @param {String} value 
   */
  createAutoR(tab, newPile, value) {
      if (tab[0] == "FState") {
        newPile.push(["£", [value + 1, newPile.length + 1 - value]]);
        newPile.push("FState");
      } else {
        let state = tab.shift();
        this.plus(state[1], 0, 1);
        newPile.push(state);
        this.createAutoR(tab, newPile, value);
      }
  }

  /**
   *
   *  Construction de l'automate de la concatenation de deux expressions
   * 
   * @param {Array} pileA 
   * @param {Array} pileB 
   * @param {String} value 
   * @returns Array
   */
  createJoinAuto(pileA, pileB, value) {
      if (pileB.length == 1) {
        return pileA.push("FState");
      } else {
        let state = pileB.shift();
        this.plus(state[1], 0, value)
        pileA.push(state);
        this.createJoinAuto(pileA, pileB, value);
      }
  }

  /**
   * 
   *  Construction de l'automate du Ou (+,|) de deux expressions
   * 
   * @param {Array} pileA 
   * @param {Array} pileB 
   * @returns Array
   */
  createOrAuto(pileA, pileB) {
      let value = pileA.length + 1;
      let value1 = pileB.length;
      let newPile = [["£", [1, value]]];
      let state = null;
      while (pileA.length > 1) {
        state = pileA.shift();
        this.plus(state[1], 0, 1);
        newPile.push(state);
      }
      newPile.push(["£", [value + value1]]);
      while (pileB.length > 1) {
        state = pileB.shift();
        this.plus(state[1], 0, value);
        newPile.push(state);
      }
      newPile.push(["£", [value + value1]]);
      newPile.push("FState");
      return newPile;
  }

  /**
   * 
   *  Construction de l'automate d' un symbol de l'alphabet
   * 
   * @param {String} symbol 
   * @returns Array
   */
  atomSymbAuto(symbol) {
      return [[symbol, [1]], "FState"];
  }

  /**
   * 
   * Incrementeur d'etats lors d'une operation de merging
   * 
   * @param {Array} tab 
   * @param {BigInt} i 
   * @param {BigInt} n 
   * @returns Array
   */
  plus(tab, i, n) {
      if (tab.length == i) {
        return tab;
      } else {
        tab[i] += n;
        this.plus(tab, i + 1, n);
      }
  }

  /**
   * 
   * construit une table qui contient l'ensemble des etats de l'AFN
   * 
   * @param {BigInt} final 
   * @param {Array} tab 
   */
  generateStateAFN(final,tab){
    let i = 0;
    while (i < final + 1) {
      tab.push(i);
      i++;
    }
  }

  /**
   * 
   * Generateur d'AFN
   * 
   * @param {Array} postExp 
   * @param {Array} pile 
   * @returns BigInt
   */
  createA_F_N(postExp, pile) {
      if (postExp.length == 0) {
        this.transitFunction = pile[0];
        this.final = this.transitFunction.length -1;
        this.generateStateAFN(this.final, this.states);
        return 1;
      } else {
        if (postExp[0] == "*") {
          let a = pile.shift();
          let begin = [["£", [1, a.length + 1]]];
          this.createAutoR(a, begin, a.length);
          pile.unshift(begin);
        } else if (postExp[0] == ".") {
          let b = pile.shift();
          let a = pile.shift();
          a.pop();
          let value = a.length;
          this.createJoinAuto(a, b, value);
          pile.unshift(a);
        } else if (postExp[0] == "+") {
          let b = pile.shift();
          let a = pile.shift();
          let orAuto = this.createOrAuto(a, b);
          pile.unshift(orAuto);
        } else {
          let s = this.atomSymbAuto(postExp[0]);
          pile.unshift(s);
        }
        postExp.shift();
        this.createA_F_N(postExp, pile);
      }
  }
}