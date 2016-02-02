## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:

* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

### Getting the database
Since the MongoDB will already be installed by now:

* start mongo: open cmd, type **mongod**, you will need to create "data/db" folders in your current drive (e.g. Windows C: Drive, create C:\Data\db).
* I have also attached the database dump. You can use the same database.

### Compiling Your Application

The first thing you should do is install the Node.js dependencies. The application comes pre-bundled with a package.json file that contains the list of modules you need to start your application.

* To install Node.js dependencies you're going to use npm again. In the application folder run this in the command-line:

```bash
$ npm install
```

* To run gulp tasks, you need to install Gulp globally. Use the following command:

```bash
$ npm install
```

### Running Your Application

* On Command Prompt inside your project home folder, write:

```bash
$ node server.js
```

OR

```bash
$ npm start
```

Your application should run on port 3000, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running by now.