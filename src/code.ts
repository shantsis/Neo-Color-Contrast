figma.showUI(__html__)
figma.ui.resize(350,425)

figma.ui.onmessage = msg => {
  if (msg.type === 'color') {
    //console.log(msg)
    //console.log(msg.data.styles)
    console.log("done running")
  }

  //figma.closePlugin()
}