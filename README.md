# API Tester
An automated api tester used for tongdao backend api testing.  

# Installation
You should have node.js&npm installed first.
Clone this repo, then `$ cd path_to_repo`.  
Run `$ npm install` to install dependencies.  
Run `$ npm install -g mocha` to install mocha.

# Map through hosts file
Run `$ sudo vim /etc/hosts`, add a single line `127.0.0.1 l`. Then save the file.  

# Run the tests
Start the api server on 127.0.0.1:3000
Run `$ mocha` to run the test.

# Write tests
This tester is written in javascript, based on node.js.  
We use **should.js** to run assertions.  
Test files are all in **test** folder.

# Why is this repo public
Because I have run out of private repo, and I want to save money.
