การ clone 
1. git clone https://github.com/Base2526/new-banlist.info.git
2. git checkout develop
3. git pull
4. git branch feature/xxxx
5. git checkout feature/xxxx
 
การเอา feature/xxx merge to develop  รวมจะได้ code update ล่าสุด
1. git checkout develop
2. git pull                    : เป็นการดึง code จาก git branch develop ล่าสุดลงมา
3. git merge feature/xxx       : branch feature/xxx จะ merge เข้า develop แล้ว
4. git branch -D feature/xxx   : ลบ branch feature/xxx 
5. git branch feature/yyy      : จะได้ branch ใหม่ feature/yyy ที code feature/xxx รวมกับ develop แล้ว
6. git checkout feature/yyy

การ commit code ขึ้น git
1. git branch                  : check ว่าเราอยู่ที่ branch อะไรก่อน
2. git add .                      
3. git commit -m "xxxx"        : xxx คำอธิบายว่าเราแก้ใข หรือ update อะไรไปบ้างเป้น ภาษาไทย/en
4. git push

การ build
1. docker-compose -f docker-compose.ui.yml build

การ run

2. docker-compose -f docker-compose.ui.yml up



server production
docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml build && docker-compose -f docker-compose.prod.yml up -d && docker-compose -f docker-compose.prod.yml up -d

