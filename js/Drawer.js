/**
 * Initialisation de l'objet de la library Go qui nous permettra
 * de dessiner nos automates
 */
var $ = go.GraphObject.make;

/**
 * 
 * fonction qui dessine un AFD
 * 
 * @param {Object} afd 
 * @param {BigInt} id 
 */
function drawAFD(afd, id) {
    let nodeDataArray = [],
        myDiagram = $(go.Diagram, id,
        {
          layout: $(go.TreeLayout,
                    { angle: 0,
                      nodeSpacing: 5,
                      layerSpacing: 10
                    })
        }),
        linkDataArray = [];
    afd.qStates.forEach(elt => {
        nodeDataArray.push(
            {key : elt}
        )
    });
    afd.transitFunction.forEach(elt => {
        linkDataArray.push({
            from : elt.init,
            to : elt.final,
            text: elt.symbol
        })
    });
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",  // the whole node panel
          // define the node's outer shape, which will surround the TextBlock
          $(go.Shape, "Circle",
            { fill: "CornflowerBlue",
            name: "state",
             spot1: new go.Spot(0, 0, 5, 5),
             spot2: new go.Spot(1, 1, -5, -5) }),
          $(go.TextBlock,
            { font: "bold 15px Trebuchet MS",
             textAlign: "center",
              maxSize: new go.Size(100, NaN) },
            new go.Binding("text", "key"))
        );
    myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
          $(go.Shape,  // the link shape
            { stroke: "black", name: "transition"}),
          $(go.Shape,  // the arrowhead
            { toArrow: "standard", fill: 'green', stroke: null }),
          $(go.Panel, "Auto",
            $(go.Shape,  // the label background, which becomes transparent around the edges
              {
                fill: $(go.Brush,
                     "Radial", 
                     { 0: "rgb(240, 240, 240)",
                        0.3: "rgb(240, 240, 240)", 
                        1: "rgba(240, 240, 240, 0)" }),
                stroke: null
              }),
            $(go.TextBlock,  // the label text
              {
                textAlign: "center",
                font: "15px Trebuchet MS",
                stroke: "red",
                margin: 1
              },
              new go.Binding("text", "text"))
          )
        );
    

    myDiagram.model = new go.GraphLinksModel(
        nodeDataArray,linkDataArray
    )
    
    afd.qStates.forEach(elt => {
        if (afd.final.indexOf(elt) != -1) {
            let node = myDiagram.findNodeForKey(elt);
            var shape = node.findObject("state");
            shape.fill = "yellow";
            shape.stroke = "orange";
        }
    });
    node = myDiagram.findNodeForKey(afd.init);
    shape = node.findObject("state");
    shape.fill = "gray";
    myDiagram.layout = new go.ForceDirectedLayout();
}

/**
 * 
 * fonction qui dessine un AFN
 * 
 * @param {Object} afn 
 * @param {BigInt} id 
 */
function drawAFN(afn, id) {
    let nodeDataArray = [],
        myDiagram = $(go.Diagram, id,
        {
          layout: $(go.TreeLayout,
                    { angle: 0,
                      nodeSpacing: 55,
                      layerSpacing: 10
                    })
        }),
        linkDataArray = [];
    afn.states.forEach(elt => {
        nodeDataArray.push(
            {key : elt}
        )
    });
    for (let i = 0; i < afn.transitFunction.length; i++) {
        for(let j=0; j < afn.transitFunction[i][1].length; j++){
            linkDataArray.push({
                from: i,
                to: afn.transitFunction[i][1][j],
                text: afn.transitFunction[i][0]
            })
        }
    }
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",  
          $(go.Shape, "Circle",
            { fill: "CornflowerBlue",
            name: "state",
             stroke: "CornflowerBlue",
             spot1: new go.Spot(0, 0, 5, 5),
             spot2: new go.Spot(1, 1, -5, -5) }),
          $(go.TextBlock,
            { font: "bold 15px Trebuchet MS",
             textAlign: "center" },
            new go.Binding("text", "key"))
        );
    myDiagram.linkTemplate =
        $(go.Link,
          $(go.Shape,  
            { stroke: "black"}),
          $(go.Shape,  
            { toArrow: "standard", fill: 'green', stroke: null}),
          $(go.Panel, "Auto",
            $(go.Shape,  
              {
                fill: $(go.Brush,
                     "Radial", 
                     { 0: "rgb(240, 240, 240)",
                        0.3: "rgb(240, 240, 240)", 
                        1: "rgba(240, 240, 240, 0)" }),
                stroke: null
              }),
            $(go.TextBlock, 
              {
                textAlign: "center",
                font: "15px Trebuchet MS",
                stroke: "red",
                margin: 1
              },
              new go.Binding("text", "text"))
          )
        );
    

    myDiagram.model = new go.GraphLinksModel(
        nodeDataArray,linkDataArray
    )
    let node = myDiagram.findNodeForKey(afn.init);
    let shape = node.findObject("state");
    shape.fill = "gray";
    shape.stroke = "black";
    node = myDiagram.findNodeForKey(afn.final);
    shape = node.findObject("state");
    shape.fill = "yellow";
    shape.stroke = "orange";
    myDiagram.layout = new go.ForceDirectedLayout();
}

/**
 * 
 * fonction qui dessine un AFD minimal
 * 
 * @param {Object} afdMin 
 * @param {BigInt} id 
 */
function drawAFDMin(afdMin, id) {
    let nodeDataArray = [],
        myDiagram = $(go.Diagram, id,
        {
          layout: $(go.TreeLayout,
                    { angle: 0,
                      nodeSpacing: 55,
                      layerSpacing: 10
                    })
        }),
        linkDataArray = [];
    afdMin.piPart.forEach(elt => {
        nodeDataArray.push(
            {key : elt[0]}
        )
    });
    afdMin.transitFunction.forEach(elt => {
        linkDataArray.push({
            from : elt.init,
            to : elt.final,
            text: elt.symbol
        })
    });
    myDiagram.nodeTemplate =
        $(go.Node, "Auto", 
          $(go.Shape, "Circle",
            { fill: "CornflowerBlue",
            name: "state",
             spot1: new go.Spot(0, 0, 5, 5),
             spot2: new go.Spot(1, 1, -5, -5) }),
          $(go.TextBlock,
            { font: "bold 15px Trebuchet MS",
             textAlign: "center",
              maxSize: new go.Size(100, NaN) },
            new go.Binding("text", "key"))
        );
    myDiagram.linkTemplate =
        $(go.Link,  
          $(go.Shape,  
            { stroke: "black", name: "transition"}),
          $(go.Shape,  
            { toArrow: "standard", fill: 'green', stroke: null }),
          $(go.Panel, "Auto",
            $(go.Shape, 
              {
                fill: $(go.Brush,
                     "Radial", 
                     { 0: "rgb(240, 240, 240)",
                        0.3: "rgb(240, 240, 240)", 
                        1: "rgba(240, 240, 240, 0)" }),
                stroke: null
              }),
            $(go.TextBlock,
              {
                textAlign: "center",
                font: "15px Trebuchet MS",
                stroke: "red",
                margin: 1
              },
              new go.Binding("text", "text"))
          )
        );
    

    myDiagram.model = new go.GraphLinksModel(
        nodeDataArray,linkDataArray
    )
    
    afdMin.piPart.forEach(elt => {
        if (afdMin.final.indexOf(elt[0]) != -1) {
            let node = myDiagram.findNodeForKey(elt[0]);
            var shape = node.findObject("state");
            shape.fill = "yellow";
            shape.stroke = "orange";
        }
    });
    node = myDiagram.findNodeForKey(afdMin.init);
    shape = node.findObject("state");
    shape.fill = "gray";
    myDiagram.layout = new go.ForceDirectedLayout();
}

/**
 * 
 * fonction qui appele celle qui construit l'automate de configuration d'un mot
 * 
 * @param {Object} afd 
 * @param {String} type 
 * @param {BigInt} num 
 */
function createConfigDiv(afd, num) {
  let div = document.createElement('div');
  div.id = who = "afdConfig"+num;
  div.style = "width: 400px;height: 200px;background-color: #DFD;border-radius: 30px 30px 30px 30px;margin: auto;";
  document.querySelector(".drawRoad").removeChild(document.querySelector(".drawRoad").firstChild);
  document.querySelector(".drawRoad").appendChild(div);
  drawConfigAFD(afd, who);
}

/**
 * 
 * construction de l'automate de configuration d'un mot a partir d'un AFD
 * 
 * @param {Object} afd 
 * @param {BigInt} id 
 */
function drawConfigAFD(afd,id) {
  let config = null,
  nodeDataArray = [],
  myDiagram = $(go.Diagram, id),
  linkDataArray = [];
  afd.qStates.forEach(elt => {
    nodeDataArray.push(
        {key : elt}
    )
  });
  config = afd.config.split("\n")
  config = config[0].split("->");
  for (let i = 0; i < config.length; i++) {
    linkDataArray.push({
      from: config[i],
      to: config[i+2],
      text: config[i+1]
    })
    i+=1;
  }

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",  
      $(go.Shape, "Circle",
        { fill: "CornflowerBlue",
        name: "state",
         spot1: new go.Spot(0, 0, 5, 5),
         spot2: new go.Spot(1, 1, -5, -5) }),
      $(go.TextBlock,
        { font: "bold 15px Trebuchet MS",
         textAlign: "center",
          maxSize: new go.Size(100, NaN) },
        new go.Binding("text", "key"))
    );
  myDiagram.linkTemplate =
    $(go.Link,  
      $(go.Shape, 
        { stroke: "black", name: "transition"}),
      $(go.Shape, 
        { toArrow: "standard", fill: 'green', stroke: null }),
      $(go.Panel, "Auto",
        $(go.Shape,
          {
            fill: $(go.Brush,
                 "Radial", 
                 { 0: "rgb(240, 240, 240)",
                    0.3: "rgb(240, 240, 240)", 
                    1: "rgba(240, 240, 240, 0)" }),
            stroke: null
          }),
        $(go.TextBlock,  
          {
            textAlign: "center",
            font: "15px Trebuchet MS",
            stroke: "red",
            margin: 1
          },
          new go.Binding("text", "text"))
      )
    );


  myDiagram.model = new go.GraphLinksModel(
    nodeDataArray,linkDataArray
)

afd.qStates.forEach(elt => {
  if (afd.final.indexOf(elt) != -1) {
      let node = myDiagram.findNodeForKey(elt);
      var shape = node.findObject("state");
      shape.fill = "yellow";
      shape.stroke = "orange";
  }
});
node = myDiagram.findNodeForKey(afd.init);
shape = node.findObject("state");
shape.fill = "gray";
}