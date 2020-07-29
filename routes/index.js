const express = require('express');
const router = express.Router();
const fs = require('fs')
const request = require('request')
const sharp = require('sharp')
const kkoApi = require('../kakaoAPI')

router.get('/', (req, res, next) => {
  sharp('D:\\20200728131650472.jpg')
      .resize({fit : 'fill', width: 1000, height: 600})
      .toFile('D:\\thumbs.jpg', (err, info) => {
        if (err) throw err
        next()
      })
});
/* GET home page. */
router.get('/', (req, res, next) => {
  /// TODO: 이미지를 읽어 들이는 처리를 해야합니다.
  kkoApi.detect('D:\\thumbs.jpg')
      .then(result => {
          req.coordinates = result
          next()
      })
      .catch(err => {
        throw err
      })
})

router.get('/', function(req, res, next) {
  // 여권 처리
  // 이름 추출, 생년 월일 추출, 여권 번호 추출
  // 문자 인식
  kkoApi.recognize('D:\\thumbs.jpg', req.coordinates)
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        throw err
      })

  res.render('index', { title: 'Express' });
});


module.exports = router;
