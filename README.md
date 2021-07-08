## [Introduction](https://github.com/kcsujeet/nodejs-auth-boilerplate#introduction)

This is a very minimal boilterplate for implementing authentication and authorization in Node-Express API.

-   **Secure:**  Built with security in mind. Anti XSS and CSRF attacks. 
-   **Feature Rich:**  Includes all the essential features like password reset, password recovery, logout of everywhere and remember me. 
-   **Scalable:** Contains only the bare bones so, can be used as the ground for projects. 


## [Usage](https://github.com/kcsujeet/nodejs-auth-boilerplate#usage)

 1. Sign up
   ```json
    POST /auth/signup
    Content-Type:  application/json
    {
    "email":  "test@gmail.com",
    "password":  "Year2021"
    }
  ```

 2. Login
  ```json
    POST /auth/signup
    Content-Type:  application/json
    {
    "email":  "test@gmail.com",
    "password":  "Year2021",
    "remember_me": true
    }
  ```

 3. Logout
  ```json
   GET /auth/logout
   Authorization: Bearer <access_token>
  ```
 4. New Access Token
  ```json
   GET /auth/token
   Authorization: Bearer <access_token>
  ```
 5. Request Password Reset
  ```json
    POST /auth/request-reset-password
    Content-Type:  application/json
    {
      "email": "test@gmail.com"
    }
  ```

 6. Change password
```json
  POST /auth/user/update/password
  Content-Type:  application/json
  Authorization: Bearer <access_token>
 {
   "password": "Year2022"
 }
```

## [FAQs](https://github.com/kcsujeet/nodejs-auth-boilerplate#faqs)

 1. **How are CSRF attacks handled?**
 
	  Only refresh token is stored in cookie. All the end points (except token refresh) accept only access token (which is advised to store in memory by client). So, attacker can't forge a false request on behalf of client. 
	 
 2. **How are XSS attacks handled?**
 
    Clients are advised to store the access token in memory to avoid XSS attacks. 
 
 3. **How to handle token refreshing in client side?**
 
    When a user logs in or signs up, an access token and it's expiry date is send by the api in the response. The client can do silent refresh by checking the expiry date to avoid interrupting the user. 

 4. **What if an attacker tries to get access token through a CSRF attack?**
 
    Since, the refresh token is stored in cookies, the attacker can definitely make a request to get an access token using the refresh token. However, this can be mitigated by using CORS policy. This way, even if the attacker makes false request, he won't get the response. 

 
 

