export function calculateContrast(foreground, background){
    var Lf = calculateRelLuminance(calculateRelValue(foreground.r), calculateRelValue(foreground.g), calculateRelValue(foreground.b))
    var Lb = calculateRelLuminance(calculateRelValue(background.r), calculateRelValue(background.g), calculateRelValue(background.b))
    if (Lf < Lb) {
        return (Lb+0.05)/(Lf+0.05)
    } 
    else {
        return (Lf+0.05)/(Lb+0.05)
    }
}

//using the formulas from the WCAG guidelines - https://www.w3.org/TR/WCAG20-TECHS/G17.html
function calculateRelValue(num: number){
    if (num <= 0.03928) {
        return num/12.92
    }
    else {
        return ((num + 0.055)/1.055)**2.4
    }
}

function calculateRelLuminance(R: number, G: number, B: number){
    return 0.2126*R + 0.7152*G + 0.0722*B 
}