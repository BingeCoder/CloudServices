# EnterpriseProject

## University Name: http://www.sjsu.edu/ 
## Course: Enterprise SW Platform
## Professor: Andrew Bond
## Student: 
## Anupama Kurudi - https://www.linkedin.com/in/anupamakn/
## Gunjan Srivastava - https://www.linkedin.com/in/gunjan-android
## Shivam Tomar - [LinkedIn](https://www.linkedin.com/in/shivam-tomar/)
## Krishna Jha

## Problem 
SkillShare.
An free online learning community where members create and attend classes on topics ranging from illustration, design, photography, video, freelancing, and more. 

## Solution 
SkillShare is an web platform where users come together as a community to help each other learn skills. These skills could range any wide range of topics from teaching/learning programming languages, coding or learning a new tool - to - guitar, voilin, marketing stragtegies or 3D animation, Yoga etc.
Users can register, login and create a profile with details such as name, email id, interests and skills they are willing to teach and skills they are interested to learn. Users can create a session/class with title, timings and brief description on what is being offered in the class.

## Technologies Used
 
AWS for setting up infrastructure
HTML, Javascript,CSS
Bootstrap
Node.js
AWS Cognito
S3 
DynamoDB
Lambda Functions
API Gateway
EC2 Instance
Route 53 for DNS
Network safety Group
AWS VPC
Github actions

## Feature List
####SSO Registration, Verification and Login 
####Facebook Login
####Social media links
####Admin Portal - Special controls
####Add / Delete Category
####User Dashboard - User profile and upload a profile picture to the S3 bucket.
####Create a class - Offer a skill / create a group activity
####Find Classes - filter activities based on Categories
####Enroll to a class - sign up for a class
####Dis-enroll from a class - Leave a class
####Create and delete classes
####Logout and login as a customer/admin
####CI/CD Pipeline

## Pre-requisites Set Up
## AWS resources required
" AWS Account
"	Amazon Cognito
"	Amazon DynamoDB
"	AWS EC2 
"	Amazon Cloudwatch
"	Amazon SNS
"	API Gateway
"	Lambda Functions
"	S3

## Skillshare Infra
Skillshare Continuous Delivery process that used to automate whole K8s release workflow, including managing configuration changes of a K8s Deployment, deployments of code changes, managing Dockerfile updates, building Docker images and pushing them to the Docker registry, applying new images on your K8s cluster, Stack used are
Jenkins Server, DockerHub, Docker, Terraform, Ansible , Kubernetes EKS (Kubectl | K8 Continues deploy | K8 Credentials).

## Admin Portal

The admin will have the following functionalities on this portal: 

1. View List of Users
2. Delete a user
3. Add a category
4. Delete a category

Test User: gunjan.srivastava@sjsu.edu
Password: Gunjan@123

## User Dashboard

User dashboard is craeted for all the users who successfully logs into he website.

1. user can create new activities
2. view all the activities that he has previously created
3. dis enroll for the activities he as signed up for
4. Find new activities
5. enroll for new activities
6. Delete the activities create by the user

## Code implementation
   Admin Portal and user dashboard have been implemented using javascript, html, bootstrap  and css as a frontend and node.js as the backend. Dynamo DB is used to store and retrieve the user data and create and manage categories and activities created within the categories. The portal is deployed on Amazon EC2 instance. All the user profile images have ben saved in S3 and services are accessed using API Gateways and lambda functions.
   
## Analytics

CloudWatch and CloudTrail are used for analytics and tracking the API
