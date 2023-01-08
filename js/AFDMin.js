class AFDMin {

    /**
     * 
     * @param {Object} afd 
     */
    constructor(afd){
        this.afd = afd;
        this.piPart = [];
        this.transitFunction = [];
        this.init = null;
        this.final = [];
        this.config = "";
        this.qStates = [];
    }

    /**
     * construction d'une pi partition 
     */
    constructPiPart(){
        let node = [];
        this.piPart.push(this.afd.final);
        this.afd.qStates.forEach(elt =>{
            if (this.afd.final.indexOf(elt) == -1) {
                node.push(elt);
            }
        })
        this.init = this.afd.init;
        this.final = this.piPart[0];
        this.piPart.push(node);
    }

    /**
     * 
     * prend un ensemble d'etats et separe en couple de deux elements par rapport a 
     * un symbol de l'alphabet
     * 
     * 
     * @param {Array} piState 
     * @param {String} s 
     * @param {Array} ne 
     * @param {Array} tr 
     * @param {Array} transitTable 
     */
    minPart(piState, s, ne, tr, transitTable){
        piState.forEach(elt =>{
            if (piState.indexOf(this.transit(elt, s, transitTable)) != -1) {
                tr.push(elt);
            }else{
                ne.push(elt);
            }
        })
    }

    /**
     * 
     * prend un etat et un symbol et retourne le transiter de cet etat sur le symbol
     * Transiter(etatActuel,symbol) ==> etatFutur
     * 
     * @param {String} elt 
     * @param {String} s 
     * @param {Array} transitTable 
     * @returns String
     */
    transit(elt, s, transitTable){
        let val = null;
        transitTable.forEach(stateT =>{
            if ((stateT.init == elt) && (stateT.symbol == s)) {
                val = stateT.final;
            }
        })
        return val;
    }

    /**
     * 
     * suppression des doublets dans piPart
     * 
     */
    piPartF(){
        let piF = [];
        this.piPart.forEach(elt =>{
        if (this.afd.searchInDEtats(piF,elt) == -1) {
                piF.push(elt);
            }
        })
        this.piPart = piF;
    }

    /**
     * 
     * Retourne le principal element d'une famille
     * [a,b] est une famille de deux elements identiaues
     * a est un synonymes de [a,b], pareil pour b
     * 
     * @param {String} state 
     * @returns String
     */
    myFamilyChooser(state){
        let val = null;
        this.piPart.forEach(elt =>{
            if (elt.indexOf(state) != -1) {
                val = elt[0];
            }
        })
        return val;
    }

    /**
     * 
     * Creer la table de transition d'un AFD minimal
     * [{init: val, symbol: val, final: val},...]
     * 
     */
    createAFDMinTransTable(){
        this.piPart.forEach(elt =>{
            this.afd.alphas.forEach(s =>{
                let state = this.myFamilyChooser(this.transit(elt[0], s, this.afd.transitFunction));
                this.transitFunction.push({
                    init: elt[0],
                    symbol: s,
                    final: state
                })
            })
        })
    }

    /**
     * 
     * Verifier si un mot appartient a une expression reguliere ou pas en 
     * utilisant la methode par configuration
     * 
     * cas d'un AFD minimal
     * 
     * @param {Object} afdMin 
     * @param {String} word 
     * @param {String} state 
     */
    wordCheck(afdMin, word, state){
      if (word.length > 0) {
        let i = 0;
        while (afdMin.transitFunction.length != i) {
          if (afdMin.transitFunction[i].init == state) {
            if (afdMin.transitFunction[i].symbol == word[0]) {
              this.config += state + "->";
              state = afdMin.transitFunction[i].final;
              this.config += word.shift() + "->";
              break;
            }
          }
          i++;
        }
        this.wordCheck(afdMin, word, state);
      }else{
        this.config += state;
        let tab = afdMin.config.split("->");
        if (afdMin.final.indexOf(tab[tab.length -1]) != -1) {
          this.config += "\n mot Accepté";
        }else{
          this.config += "\n mot non reconnu";
        }
      }
      
    }

    /**
     * 
     * Construire une table de l'ensembles des etats qui constitue piPart
     * 
     */
    generateQStates(){
        this.piPart.forEach(elt =>{
            if (this.qStates.indexOf(elt[0] == -1)) {
                this.qStates.push(elt[0]);
            }
        })
    }

    /**
     * 
     * construction d'une table de piPart a partir de l'algorithme 
     * de separation
     * 
     */
    detGroupByTrans(){
        let pIi = [], initPIi = this.piPart;
        this.afd.alphas.forEach(s => {
            pIi = [];
            let i = 1, bool=true;
            console.log(s);
            while (bool) {
                i = 1;
                initPIi.forEach(piState => {
                    let ne = [], tr = [];
                    this.minPart(piState, s, ne, tr, this.afd.transitFunction);
                    if (ne.length != 0) {
                        pIi.push(ne);
                    }else{
                        i++;
                    }
                    if (tr.length != 0) {
                        pIi.push(tr);
                    }else{
                        i++;
                    }
                });
                if(i>= initPIi.length) bool= false;
            }
            initPIi = pIi;
        });
        if (this.piPart.length == initPIi.length) {
            this.piPart = initPIi;
        }else{
            this.piPart = initPIi;
            this.detGroupByTrans();
        }
        this.piPartF();
    }
}