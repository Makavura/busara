Busara Data Collection

Project Setup:
- git clone https://github.com/Makavura/busara.git
- cd busara
- npm i
- setup client id and client secret as provided in src\app\authentication.service.ts
- setup token received in registration in the authorization headers src\app\http.interceptor.ts
- ng serve
- go to localhost:4200/ to view application

Features/Views:
- authentication/authorization
    - login
    - logout
    - authentication state based component rendering
- Tree
    - toggle node to hide/view content
    - dynamic node content mapping
- Surveys
    - time tracking - start to finish
    - dynamic question type mapping: tel, text, radio
    - survey submission
    - form disabling until survey respondent is response ready



