# DevConnect

**Live Demo:** [https://devconnect-xekl.onrender.com](https://devconnect-xekl.onrender.com)

my full stack project for developer networking. built with node, express, mongodb, and html/css.

### features
- login / signup (jwt auth)
- create posts with images or videos
- like and comment on posts
- follow other devs
- search developers by their username/skills
- edit profile

### to run locally
1. `npm install`
2. make sure mongodb is running on your pc
3. create a `.env` file and add:
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/devconnect
   JWT_SECRET=somesecretkey
   ```
4. `mkdir uploads` in the main folder (this is where images save)
5. `node server.js`
6. open localhost:3000

---
made by Hiral
