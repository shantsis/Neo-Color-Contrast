
export async function getColors(personalAccessToken:string, fileID:string) {

    let result = await fetch(`https://api.figma.com/v1/files/${fileID}`, {
        method: 'GET',
        headers: {
            'X-Figma-Token': personalAccessToken
        }
    })

    let result2 = await fetch(`https://api.figma.com/v1/files/${fileID}/styles`, {
        method: 'GET',
        headers: {
            'X-Figma-Token': personalAccessToken
        }
    })


    let data = await result.json()
    let data2 = await result2.json()

    return [data, data2]

}