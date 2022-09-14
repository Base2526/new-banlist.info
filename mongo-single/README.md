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
            user: "root",
            pwd: "b9be11166d72e9e3ae7fd407165e4bd2",
            roles: [ { role: 'root', db: 'admin' } ]
        });

         <!-- db.createUser({
            user: "banlistinfo",
            pwd: "6c09093474284f6bfc3749a5bd24cbb6",
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



Backup
https://davejansen.com/how-to-dump-restore-a-mongodb-database-from-a-docker-container/

docker exec -i a67d48abfccf /usr/bin/mongodump --username banlistinfo --password 6c09093474284f6bfc3749a5bd24cbb6 --authenticationDatabase admin --db bl --port 29101 --out /dump
docker exec -i mongo /usr/bin/mongodump --username banlistinfo --password 6c09093474284f6bfc3749a5bd24cbb6 --db bl --port 29101 --out /dump

