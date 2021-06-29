const express = require('express')
const app = express()
const port = 3000

const connect = require('./schemas')
connect()

app.use(express.urlencoded({ extended: false })) // 동기? 비동기? 순서가 중요하네? goodsRouter 보다 아래 있으니 에러!
app.use(express.json()) // json 가져오는 express 사용법?
app.use(express.static('public')) // statuc 폴더 경로 명시?

const postRouter = require("./routers/post")//라우터를 생성한다. goods.js파일을 라우터로 사용한다.
app.use("/api", [postRouter]);//api를 호출해서 get등의 방식으로 데이터를 리턴한다

// ejs 사용한다?
app.set('views', __dirname + '/views') // 경로 명시?
app.set('view engine', 'ejs')

// 1. 전체 게시글 목록 조회 페이지
//     - 제목, 작성자명, 작성 날짜를 조회하기
//     - 작성 날짜 기준으로 내림차순 정렬하기
//     - 특정 게시글을 클릭할 경우 `게시글 조회 페이지`로 이동하기
app.get('/', (req, res) => {
    res.render('index')
})

  // 2. 게시글 작성 페이지
  //     - 제목, 작성자명, `비밀번호`, 작성 내용을 입력하기
  //     - 글을 작성 한 후 "글쓰기" 버튼을 클릭하면 `전체 게시글 목록 조회 페이지`로 이동하고, 최신 게시글이 최상단에 위치함을 확인하기
app.get('/new', (req, res) => {
    res.render('new')
})

  // 3. 게시글 조회 페이지
  //     - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기
  

app.get('/detail', (req, res) => {// localhost:5000/detail?goodsId=10의 형식으로 사용, id를 가져온다
    let id = req.query.postId
    res.render('detail', {id}) // 
})

// 4. 게시글 수정 페이지
  //     - 작성 페이지와 동일한 폼. 수정하기 버튼을 눌렀던 게시글이 미리 입력되게 하기
  //     - 비밀번호란은 비워두기
  //     - "글쓰기" 버튼은 없고 "수정 완료", "삭제하기" 버튼만 만들기
  //     - "수정완료" 버튼을 누를 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
  //     - "삭제하기" 버튼을 누를 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
app.get('/modify', (req, res) => {
    let id = req.query.postId
    res.render('modify', {id}) // 
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})