# distribution-practice
Node.js express 기반 프로젝트를 AWS Lightsail로 배포해보기

Address: 43.201.51.18:8080/


| URI | method | descipt | request | response | etc. |
| --- | --- | --- | --- | --- | --- |
| /auth/join | POST | 회원가입 | { email, nick, password } | { success, msg } | isNotLoggedIn |
| /auth/login | POST | 로그인 | { email, password } | { success, msg } | isNotLoggedIn |
| /auth/logout | GET | 로그아웃 | - | { success, msg } | isLoggedIn |
| /post | POST | 게시물 등록 | { content, img, user } | { success, msg } | isLoggedIn |
| /post/img | POST | 게시물 이미지 업로드 | img (Formdata) | { success, url } | isLoggedIn |
| /post/hashtag | GET | 해시태그로 게시물 검색 | - | { success, posts } |  |
| /user/:id/follow | POST | ‘id’ user 팔로우 | - | { success, msg } | isLoggedIn |
