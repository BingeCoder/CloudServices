export default class Skills {

    constructor(username, email, activityName, time, desc, capacity)
    {
        this.username = username;
        this.activityName = activityName;
        this.email = email;
        this.time = time;
        this.desc = desc;
        this.capacity = capacity;
    }

     setUsername(username) {
        this.username = username;
    }

     getUsername() {
        return this.username;
    }

     setActivityName(activityName) {
        this.activityName = activityName;
    }

     getActivityName() {
        return this.activityName;
    }

     setEmail(email) {
        this.email = email;
    }

     getEmail() {
        return this.email;
    }

     setTime(time) {
        this.time = time;
    }

     getTime() {
        return this.time;
    }

     setDesc(desc) {
        this.desc = desc;
    }

     getDesc() {
        return this.desc;
    }

     setCapacity(capacity) {
        this.capacity = capacity;
    }

     getCapacity() {
        return this.capacity;
    }
}
