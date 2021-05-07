import './ui.css'
import '../node_modules/@avaya/neo/neo/dist/css/neo/neo.min.css'
import {getColors} from "./data"
import {calculateContrast} from "./contrast"
import {personalAccessToken, fileID} from "./credentials"

//pull the version history data
var promise =  getColors(personalAccessToken, fileID).catch(error => console.log(error))
promise.then(function(data){

  //grab the color styles
  extractStyles(data[1], colors)
  extractColors(data[0], colors)
  
  //sort the colors to appear in order
  colors.sort(function(a, b){return a.name.localeCompare(b.name)})

  //add them to the dropdowns    
  var foreground = document.getElementById("foreground") as HTMLSelectElement
  var background = document.getElementById("background") as HTMLSelectElement

  for (let i in colors) {
    addOption(foreground, colors[i].name, colors[i].id)
    addOption(background, colors[i].name, colors[i].id)
  }

  //update the contrast level based on user input
  foreground.addEventListener('change', (e) => {
    var selection = getSelectedColors()
    readOutput(selection[0], selection[1])
  })
  background.addEventListener('change', (e) => {
    var selection = getSelectedColors()
    readOutput(selection[0], selection[1])
  })
  
  //return the value to code.ts
  parent.postMessage({ pluginMessage: { type: 'color', colors } }, '*')
})


//define the color array to store the values
let colors: any[] = []

//calculate the contrast level, and show its acceptable usage
function readOutput(findex: number, bindex: number) {
  
  //calculate the contrast
  var contrast = calculateContrast(colors[findex], colors[bindex])
  
  //add the contast level to the UI
  document.getElementById("contrast").innerHTML = contrast.toFixed(2)

  //if its over 4.5, it passes WCAG AA on all 3 items
  if (contrast >= 4.5) {
    setToPass(<HTMLSpanElement>document.getElementById("UIElements"))
    setToPass(<HTMLSpanElement>document.getElementById("LargeText"))
    setToPass(<HTMLSpanElement>document.getElementById("Text"))
  }
  
  //if its less than 4.5 but greater than 3, it passes WCAG AA for UI elements and large text only
  else if (contrast >= 3) {
    setToPass(<HTMLSpanElement>document.getElementById("UIElements"))
    setToPass(<HTMLSpanElement>document.getElementById("LargeText"))
    setToFail(<HTMLSpanElement>document.getElementById("Text"))
  }
  
  //otherwise it fails for all items and should not be used! (unless its one of the exceptions outlined in WCAG)
  else {
    setToFail(<HTMLSpanElement>document.getElementById("UIElements"))
    setToFail(<HTMLSpanElement>document.getElementById("LargeText"))
    setToFail(<HTMLSpanElement>document.getElementById("Text"))
  }

  //convert the color for the example background to hex and display it on the UI
  var DIVid= <HTMLDivElement>document.getElementById("contentArea")
  DIVid.style.backgroundColor = "rgb("+ Math.round(colors[bindex].r*255) + ',' + Math.round(colors[bindex].g*255) + ',' + Math.round(colors[bindex].b*255) + ")"
 
  //convert the color for the example foreground to hex and display it on the UI
  var text1ID= <HTMLParagraphElement>document.getElementById("text1")
  var text2ID= <HTMLParagraphElement>document.getElementById("text2")
  var iconID = <HTMLSpanElement>document.getElementById("UIexample")
  text1ID.style.color = "rgb("+ Math.round(colors[findex].r*255) + ',' + Math.round(colors[findex].g*255) + ',' + Math.round(colors[findex].b*255) + ")"
  text2ID.style.color = "rgb("+ Math.round(colors[findex].r*255) + ',' + Math.round(colors[findex].g*255) + ',' + Math.round(colors[findex].b*255) + ")"
  iconID.style.color = "rgb("+ Math.round(colors[findex].r*255) + ',' + Math.round(colors[findex].g*255) + ',' + Math.round(colors[findex].b*255) + ")"
}

//get the current colors selected on the foreground and background dropdowns
function getSelectedColors(){
  var fColor = (<HTMLSelectElement>document.getElementById("foreground")).selectedIndex
  var bColor = (<HTMLSelectElement>document.getElementById("background")).selectedIndex
  return [fColor, bColor]
}

//if a line item passes, use the check icon from NEO
function setToPass(id){
  id.classList.remove("neo-icon-close")
  id.classList.add("neo-icon-check")
  id.style.color = "#51A651"
  id.setAttribute('aria-label', "pass")
}

//otherwise use the X icon from neo
function setToFail(id){
  id.classList.remove("neo-icon-check")
  id.classList.add("neo-icon-close")
  id.style.color = "#E56E6E"
  id.setAttribute('aria-label', "fail")
}

//grab the colors from the original file. Get the name and ID, and create a placeholder for the color values to be grabbed later
function extractStyles(data, colors){
  var styles = data.meta.styles
  for (let i in styles) {
    if (styles[i].style_type == "FILL") {
      var color = {
        id: styles[i].node_id,
        name: styles[i].name,
        r: "",
        g: "",
        b: ""
      }
      colors.push(color)

    }
  }
}

//grab the colors from the original file. They need to be rectangles on the page to find and pick up the RGB value
function extractColors(data, colors){
  var components = data.document.children[1].children //page 2 Color & Opacity
  //loop through frames
  for (let i in components){
    //loop through rectangles
    for (let j in components[i].children) {
      if (components[i].children[j].type == "RECTANGLE" || components[i].children[j].type == "VECTOR") {
        var id = components[i].children[j].styles.fill
        //check the colors for an id match
        for (let k in colors) {
          if (colors[k].id === id) {
            colors[k].r = components[i].children[j].fills[0].color.r
            colors[k].g = components[i].children[j].fills[0].color.g
            colors[k].b = components[i].children[j].fills[0].color.b
            break
          }
        }
      }
    }
  }
}

//add the color option to the dropdown
function addOption(id, name, value) {
  var option = document.createElement("option") as HTMLOptionElement
  option.text = name
  option.value= value
  id.add(option)
}

