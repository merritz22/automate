
var num = 0;

document.querySelector('body').onload = ()=>{
    let r = null,
        afn = null,
        afd = null;

    document.querySelector(".begin").addEventListener('click',()=>{
        let regex = document.querySelector('#regex').value;
        let alpha = document.querySelector('#alphabet').value;
        alpha = checkAlpha(alpha);
        if (alpha != -1) {
            alpha = alpha.toString();
            if (checkRegex(regex, alpha)) {
               try {
                    onBegin(regex, alpha);
               } catch (error) {
                   document.querySelector('.debug').textContent = "Expression regulière incorrect !!";
               } 
            }else{
                document.querySelector('.debug').textContent = "La correspondance entre les valeurs n'est pas bonne !!";
            }
        }else{
            document.querySelector('.debug').textContent = "L'alphabet est incorrect !!";
        }

    })
    document.querySelector(".begin").click();

    function onBegin(regex, alpha) {
        r = new Regex(regex);
        r.createPostExp(r.reg,[],r.postExp);
        afn = new AFN(alpha);
        afn.createA_F_N(r.postExp,[]);

        afd = new AFD(alpha);
        afd.generateDFA(afn.transitFunction, 
            afd.transitFunction, 
            afd.states, 
            afd.alphas);
        
        afdMin = new AFDMin(afd);
        afdMin.constructPiPart();
        afdMin.detGroupByTrans();
        afdMin.generateQStates();
        afdMin.createAFDMinTransTable();
        console.log(afdMin);
        
        drawAFN(afn, "afnDiv");

        drawAFD(afd, "afdDiv");
        
        drawAFDMin(afdMin, "afdMinDiv");
    }

    document.querySelector(".checkAFD").addEventListener('click',()=>{
        let word = document.querySelector("#word").value.split("");
        if (afd != null) {
            afd.config = "";
            afd.wordCheck(afd, word, afd.init);
            document.querySelector("#roadConfigOfAFD").value = (afd.config.split("\n"))[0];
            document.querySelector(".debug").textContent = (afd.config.split("\n"))[1];
        }
        try {
            createConfigDiv(afd, "AFD", num);
        } catch (error) {
            document.querySelector(".debug").textContent = "Mot non valide";
        }
        num++;
    })

    document.querySelector(".checkAFDMin").addEventListener('click',()=>{
        let word = document.querySelector("#word").value.split("");
        if (afdMin != null) {
            afdMin.config = "";
            afdMin.wordCheck(afdMin, word, afdMin.init);
            document.querySelector(".debug").textContent = (afdMin.config.split("\n"))[1];
            document.querySelector("#roadConfigOfAFDMin").value = (afdMin.config.split("\n"))[0];
        }
        try {
            createConfigDiv(afdMin, "AFD", num);
        } catch (error) {
            document.querySelector(".debug").textContent = "Mot non valide";
        }
        num++;
    })
}