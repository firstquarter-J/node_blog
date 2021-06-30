const express = require("express")
const { title } = require("process")
const router = express.Router() //라우터라고 선언한다.

const url = require('url')
const Post = require("../schemas/post")

// 첫 화면. db에 저장된 글 가져와서 클라이언트에 보내줌
router.get("/load-post", async (req, res, next) => { // post
    try {
      const { posts } = req.query //posts를 query string으로 받아온다
      const post = await Post.find({ posts }).sort("-postId") //검색할 카테고리를 포함한 post를 postId 역정렬(마이너스)
      res.json({ post: post }) //결과를 json에 담는다
    } catch (err) {
      console.error(err)
      next(err)
    }
  })

//   Application Programming Interface
// 응용 프로그램 프로그래밍 인터페이스
// 프로그램 안의 작은 프로그램

// 입력한 데이터 db에 저장
router.post('/save-post', async (req, res) => { // post
    const recentPost = await Post.find().sort("-postId").limit(1) // 최근 포스트 찾아서 정렬
    let postId = 1 // 
    if(recentPost.length != 0){ // 최근 포스트가 있으면
      postId = recentPost[0]['postId'] + 1 // 새 배열 생성해서 1번부터 번호 부여
    }
    console.log(req.body)//저장할 아이템들을 body로 받아오므로, body를 한번 찍어봤다.
    const { title, description, author, password } = req.body //받은 body를 변수로 하나씩 넣어준다.

    const date = ( new Date().format("yyyy-MM-dd a/p hh:mm:ss"))
    await Post.create({ postId, title, description, author, date, password }) //만들어서 집어넣는다.
    res.send({ result: "success" }) //잘했다고 칭찬해준다.ㅋㅋㅋㅋㅋㅋㅋㅋ
  })


// api 설계 설명 예시
// post 상세 페이지. 하나의 값만 가져와 // 넌 어디서 왜 왔어? // 망각의 동물
router.get("/detail", async (req, res, next) => { // detail
  try {
    const { postId } = req.query //카테고리를 query string으로 받아온다
    const post = await Post.findOne({ postId }) 
    res.json({ post: post }) //결과를 json에 담는다
  } catch (err) {
    console.error(err)
    next(err)
  }
}) // 위아래 동일한 기능의 api 막 가져다 쓰니 중복. 개발자란 모름지기 중복제거에 목숨을 걸어야 함

// 수정 페이지에서 postId 망할값 가져와 입력창에 표시해주는 api
router.get("/modify", async (req, res, next) => { // modify
  try {
    const { postId } = req.query;//카테고리를 query string으로 받아온다
    const post = await Post.findOne({ postId }) 
    res.json({ post: post }) //결과를 json에 담는다
  } catch (err) {
    console.error(err)
    next(err)
  }
})
//

// 글 하나만 찾아오는 api : findeOne_post
router.get("/find-one-post", async (req, res, next) => { // modify
  try {
    const { postId } = req.query;//카테고리를 query string으로 받아온다
    const post = await Post.findOne({ postId }) 
    res.json({ post: post }) //결과를 json에 담는다
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// 수정 페이지 modify 에서 업데이트
router.post('/update-post', async (req, res) => { // modify

  const { postId } = req.query //카테고리를 query string으로 받아온다
  const { title, description, author, password } = req.body //받은 body를 변수로 하나씩 넣어준다.
  const id = await Post.findOne({ postId }) // js의 위력. 선언하지 않고도 쓴다
  const pwd = id["password"]
    // console.log(pwd)
  if ( pwd == password ) {
    await Post.updateOne({ postId }, { $set: { title, description, author, password } })
    
    res.send({ result: "success" }) //잘했다고 칭찬해준다.ㅋㅋㅋㅋㅋㅋㅋㅋ
  } else {
    res.send({ result: "혼날래?"})
  }
})

// post 삭제 - 수정 페이지에서
router.delete("/delete-post/:postId", async (req, res) => { // /modify/:postId
  const { postId } = req.params
  const { password } = req.body //받은 body를 변수로 하나씩 넣어준다.
  const id = await Post.findOne({ postId }) // js의 위력. 선언하지 않고도 쓴다
  const pwd = id["password"]
  if ( pwd == password ) {
    await Post.deleteOne({ postId })
    res.send({ result: "success" }) //잘했다고 칭찬해준다.ㅋㅋㅋㅋㅋㅋㅋㅋ
  } else {
    res.send({ result: "비밀번호가 틀렸습니다!" }) //틀렸다고 혼내준다
  }
})

// // 수정 페이지 - 입력 페이지와 같은 틀 이지만 저장 된 값을 placeholder에 표시
// router.patch("/modify/:postId", async (req, res) => { // /modify/:postId
//   const { postId } = req.params
//   const { title, description, author, date, password } = req.body;
//   isExist = await Post.find({ postId })
//   if(isExist[0]['password']==password){
//     await Post.updateOne({ postId }, { $set: { postId, title, description, author, date, password } })
//     res.send({ result: "success" })
//   }else{
//     res.send({result : "failed"})
//   }
// })

// date 함수 사용할때 쓰는데 나중에 보면 알겠지
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " "

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
    var d = this
        
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear()
            case "yy": return (d.getFullYear() % 1000).zf(2)
            case "MM": return (d.getMonth() + 1).zf(2)
            case "dd": return d.getDate().zf(2)
            case "E": return weekName[d.getDay()]
            case "HH": return d.getHours().zf(2)
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2)
            case "mm": return d.getMinutes().zf(2)
            case "ss": return d.getSeconds().zf(2)
            case "a/p": return d.getHours() < 12 ? "오전" : "오후"
            default: return $1
        }
    })
}

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;}
String.prototype.zf = function(len){return "0".string(len - this.length) + this;}
Number.prototype.zf = function(len){return this.toString().zf(len);}

module.exports = router //얘 라우터라고 알려주는거임 // 그러니까 그걸 왜 못 찾았지