const fs = require('fs')
const request = require('request')

const API_KEY = 'YOUR ARE API KEY'
const generatorOption = (key, formData) => {
    return {
        uri : `https://kapi.kakao.com/v1/vision/text/${key}`,
        method : 'POST',
        headers : {
            'Authorization' : `KakaoAK ${API_KEY}`,
            'Content-Type' : 'multipart/form-data',
        },
        formData : formData,
        json : true
    }
}

const detect = (path = '') => {
    const formData = { file : fs.createReadStream(path) }
    const option = generatorOption('detect', formData)
    console.log(option)
    return new Promise((resolve, reject) => {
        request.post(option, (err, res, body) => {
            if (err) reject(err)
            const boxes = body.result.boxes
            let result = "["
            boxes.map((rectangle, boxIdx) => {
                result += "["
                rectangle.map((coordinates, idx) => {
                    result += "["
                    result += coordinates.join(',')
                    result += rectangle.length - 1 > idx ? "]," : "]"
                })
                result += boxes.length -1 > boxIdx ? "]," : "]"
            })
            result += "]"
            resolve(result)
        })
    })
}

const recognize = (path = '', coordinates) => {
    const formData = { file : fs.createReadStream(path), boxes : coordinates }
    const option = generatorOption('recognize', formData)
    return new Promise((resolve, reject) => {
        request.post(option, (err, res, body) => {
            if (err) reject(err)
            resolve(body.result)
        })
    })
}




module.exports = { detect : detect, recognize : recognize }