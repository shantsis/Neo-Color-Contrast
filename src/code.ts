figma.showUI(__html__)
figma.ui.resize(350,360)

figma.ui.onmessage = msg => {
  if (msg.type === 'color') {
    console.log("done running")
  }

  //figma.closePlugin()
}