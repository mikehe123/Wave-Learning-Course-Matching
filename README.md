# Wave-Learning-Course-Matching

This is a Node.js Module I developed for [Wave Learning Festival](https://www.wavelf.org), an online educational platform that provides free education for low-income family students.

This course matching module is a four stages pipelined that take student and seminar databases from Wave to match students with their selected courses. The matching ouput is configurable based on students' choice, classsize, registration time, and course level.  

## The Matching pipline

### Stage one 

Registration data will be cleaning, validated, and partially joined with the student information database. The cleaned registration data will be batched into five groups based on selected course number. Seminar data will generate a list sets of conflicitng courses based on classtimes. The regisration data will be pre-analyzed to make a statistics summary available, such as top 10 popular courses. 

### Stage two

The batched data groups enters the matching algorithm. Based on module configurations that mentioned above, students will be registered by group order. If a course reach configured class size limit, it will stoped be matched and students who didn't get the course will enter into a temporary waiting pool and getting higher priority for his/her next best matched course. Every student will be guaranteed to matched with one seminar. After course matching, a list of matching result will be generated. 

### Stage three

The finished regisration data will be written into .csv files matching schemas from Wave Learning's database. Students who didn't get a desirable number of seminar will be entered into a waitlist file for future updates. A summary of regisreation statistics will be generated.

### Stage four

Stage four will update matching. It will enter new students regisration data for new matchs without overriding existing matching result. It is desgined for students who missed the main registration time. The new matching results and statistics will be generated as mentioned above. 


## Matching report example. 

### Pre-matching statisitcs 
![Picture1](https://user-images.githubusercontent.com/71740368/139270980-d4fb41cc-c26e-4f60-92d3-77160fb951a2.png)

### After-matching statisitcs 
![Picture2](https://user-images.githubusercontent.com/71740368/139271078-7b542bfb-6e62-4714-bb80-cdd23bbd1482.png)
