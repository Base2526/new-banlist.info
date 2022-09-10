mongoimport --db dbName --collection collectionName --file fileName.json


การ manage user role
1. เราต้อง edit mongod.conf
    security:
        authorization: "enabled"
    
    จะมี file ตัวอย่าง
    mouth 
    - ./mongod.conf:/etc/mongod.conf

2. docker exec -it xxxx bash
3. mongosh เข้าไปเพื่อสร้าง user admin 
   3.1  use admin
   3.2  db.createUser({
            user: "xxx",
            pwd: "yyy",
            roles: [ { role: 'root', db: 'admin' } ]
        });

         <!-- db.createUser({
            user: "xxx",
            pwd: "yyy",
            roles: [ { role: 'readWrite', db: 'bl' } ]
        }); -->

4. exit แล้วเรา mongosh -u xxxx -p yyyy เพือ login auth


       <!-- db.createUser({
            user: "banlistinfo",
            pwd: "6c09093474284f6bfc3749a5bd24cbb6",
            roles: [ { role: 'readWrite', db: 'bl' } ]
        }); -->


        basic command
        - use xxx 
        - db.getUsers()

