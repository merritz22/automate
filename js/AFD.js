class AFD{
    /**
     * Ici, on construit un afd a partir d' une
     * regex
     * 
     * @param {String} alphas 
     */
    constructor(alphas){
        this.alphas = alphas.split(",");
        this.transitFunction = [];
        this.states = [];
        this.qStates = [];
        this.init = "q0";
        this.final = [];
        this.config = "";
    }

    /**
     * 
     * On calcule l'epsilon fermeture d'un etat
     * 
     * @param {Object} afn 
     * @param {String} state 
     * @param {Array} markpile 
     */
    eFermeture(afn, state, markpile){
        let i= 0;
        while(state.length != i){
            // console.log(afn);
          if(afn[state[i]][0] == "£"){
            let j = 0;
            while(afn[state[i]][1].length != j){
              if(state.indexOf(afn[state[i]][1][j]) == -1){
                state.push(afn[state[i]][1][j]);
              }
              j++;
            }
          }
          markpile.push(state[i]);
          i++;
        }
        // console.log(markpile);
    }

    /**
     * On calcul le transiter d'un ensemble d'etats sur un 
     * symbol
     * 
     * @param {Object} afn 
     * @param {String} states 
     * @param {String} symbol 
     * @param {Array} newPile 
     * @param {BigInt} i 
     * @returns Array
     */
    transiter(afn, states, symbol, newPile,i) {
        // console.log(afn);
        let newStates = states;
        if (newStates.length == i || newStates[i] == undefined) {
          // console.log(newPile);
          return newPile;
        } else {
          // console.log(newStates);
          let num = newStates[i];
          // console.log(i);
          if (afn[num][0] == symbol) {
            let j = 0;
            while (afn[num][1].length != j) {
              newPile.push(afn[num][1][j]);
              // if (newStates.indexOf(afn[num][1][j]) == -1) {
              //   newStates.push(afn[num][1][j]);
              //   // console.log(afn[num][1][j]);
              // }
              j++;
            }
          }
          this.transiter(afn, newStates, symbol, newPile,i+1);
        }
    }

    /**
     * 
     * @param {Object} afn 
     * @param {String} symbol 
     * @param {Array} states 
     * @param {Array} e_tab 
     * @returns Array
     */
    eFermTransiter(afn, symbol, states, e_tab) {
        // console.log(states);
        let tab =[];
        this.transiter(afn, states, symbol, tab, 0);
        e_tab = [];
        // console.log(tab)
        while (tab.length != 0) {
          let elt = tab.shift();
          this.eFermeture(afn, [elt], e_tab);
        }
        // console.log(e_tab);
        return e_tab;
    }

    /**
     * 
     * @param {Array} tab1 
     * @param {Array} tab2 
     * @returns BigInt
     */
    compareTab(tab1, tab2) {
        let i = 0;
        // console.log(tab1);
        if ((tab1.length > tab2.length) || (tab1.length < tab2.length)) {
          return 0;
        } else {
          while ((i != tab1.length) && (tab1.indexOf(tab2[i])) != -1) {
            i++;
          }
          if (i != tab1.length) {
            return 0;
          } else {
            return 1;//on signale que l'ensemble existe deja
          }
        }
    }

    /**
     * 
     * @param {Array} dEtats 
     * @param {Array} aTab 
     * @returns BigInt
     */
    searchInDEtats(dEtats,aTab) {
        let i=0;
        while ( (i != dEtats.length) && (this.compareTab(dEtats[i],aTab) == 0)) {
          i++;
        }
        if(i == dEtats.length){
          // console.log("new state supposed to be added");
          return -1;
        }else{
          // console.log(i);
          return i;
        }
    }

    /**
     * 
     * @param {Object} afn 
     * @param {Array} DEtats 
     */
    generateStateAFD(afn, DEtats){
      let i = 0;
      while (i < DEtats.length) {
        if (DEtats[i].indexOf(afn.length -1) != -1) {
          this.final.push("q"+i);
        }
        this.qStates.push("q"+i);
        i++;
      }
    }

    /**
     * 
     * @param {Object} afn 
     * @param {Array} DTran 
     * @param {Array} DEtats 
     * @param {Array} alphas 
     * @returns Array
     */
    generateDFA(afn, DTran, DEtats, alphas) {
        let l = [],
          aState = [],
          q = this.eFermeture(afn,[0],l),
          i = 0;
          DEtats.push(l);
        //   console.log(DEtats);
        while (DEtats.length != i) {
          aState = DEtats[i];
          alphas.forEach(symbol => {
            l = [];
            q = this.eFermTransiter(afn,symbol,aState,[]);
            if (this.searchInDEtats(DEtats, q) == -1) {
              DEtats.push(q);
            }
              DTran.push({
                init: "q"+i,
                symbol: symbol,
                final: "q"+(this.searchInDEtats(DEtats, q))
              })
          });
          i++;
        }
        this.generateStateAFD(afn, DEtats);
        return DTran;
    }

    /**
     * 
     * Verifier si un mot appartient a une expression reguliere ou pas en 
     * utilisant la methode par configuration
     * 
     * cas d'un AFD
     * 
     * @param {Object} afd 
     * @param {String} word 
     * @param {String} state 
     */
    wordCheck(afd, word, state){
      if (word.length > 0) {
        let i = 0;
        while (afd.transitFunction.length != i) {
          if (afd.transitFunction[i].init == state) {
            if (afd.transitFunction[i].symbol == word[0]) {
              this.config += state + "->";
              state = afd.transitFunction[i].final;
              this.config += word.shift() + "->";
              break;
            }
          }
          i++;
        }
        this.wordCheck(afd, word, state);
      }else{
        this.config += state;
        let tab = afd.config.split("->");
        if (afd.final.indexOf(tab[tab.length -1]) != -1) {
          this.config += "\n mot Accepté";
        }else{
          this.config += "\n mot non reconnu";
        }
      }
      
    }
}