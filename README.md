# Devops project

# Global architecture diagram

![](img/global_architecture.png)

# Use case diagram

![](img/usecase.png)

# Functionalities

- First we have **list products** and **see product details** which is accessible by CLIENT and ADMIN
- Second we have **add**, **modify** and **delete** product accessible only by the ADMIN

#### CLIENT
- list products

![](img/img.png)

- see product details

![](img/img_5.png)
#### ADMIN
- list, add, edit and delete product

![](img/img_1.png)

- Then the ADMIN can **list all the commands** (the commands of all clients)
- But the CLIENT can **see his own commands** only and can **create new commands**

#### ADMIN
- list command

![](img/img_2.png)

#### CLIENT

- list his own commands

![](img/img_3.png)

- create new command

![](img/img_4.png)

- Finally we have profile page where we can see the user role and he can logout

#### ADMIN & CLIENT
![](img/img_6.png)