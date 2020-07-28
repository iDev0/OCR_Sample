const express = require('express');
const router = express.Router();
const fs = require('fs')
const request = require('request')
const sharp = require('sharp')

let arrayToString = ""
router.get('/', (req, res, next) => {
  sharp('D:\\20200728091319121.jpg')
      .resize({fit : 'fill', width: 400, height: 600})
      .rotate()
      .toFile('D:\\thumbs.jpg', (err, info) => {
        if (err) throw err
        next()
      })
});
/* GET home page. */
router.get('/', (req, res, next) => {
  const options = {
    uri : 'https://kapi.kakao.com/v1/vision/text/detect',
    method : 'POST',
    headers : {
      'Authorization' : 'KakaoAK {API_KEY}',
      'Content-Type' : 'multipart/form-data',
    },
    formData : { file : fs.createReadStream('D:\\thumbs.jpg') },
    json : true
  }

  const response = res

  request.post(options, (err, res, body) => {
    if (err) throw err
    const boxes = body.result.boxes
    let result = "["
    boxes.map((rectangle, boxIdx) => {
      result += "["
      rectangle.map((coordinates, idx) => {
        result += "["
        // coordinates.map(xy => {
        //     result += xy
        // })
        result += coordinates.join(',')
        // console.log(rectangle.length)
        // console.log(idx)
        result += rectangle.length - 1 > idx ? "]," : "]"
      })
      result += boxes.length -1 > boxIdx ? "]," : "]"
    })
    result += "]"
    arrayToString = result
    console.log(result)
    next()
  })
})

router.get('/', function(req, res, next) {
  // 여권 처리
  // 이름 추출, 생년 월일 추출, 여권 번호 추출
  // 문자 인식
  const options = {
    uri : 'https://kapi.kakao.com/v1/vision/text/recognize',
    method : 'POST',
    headers : {
      'Authorization' : 'KakaoAK  {API_KEY}',
      'Content-Type' : 'multipart/form-data',
    },
    formData : { file : fs.createReadStream('D:\\thumbs.jpg'), boxes : arrayToString },
    json : true
  }

  request.post(options, (err, res, body) => {
      if (err) throw err
      console.log(body.result)
  })

  res.render('index', { title: 'Express' });
});


module.exports = router;
