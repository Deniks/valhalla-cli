require('dotenv').config();
const mongoose = require('mongoose');

const assert = require('assert');
const bcrypt = require('bcrypt');
const fs = require('fs');
const CLI = require('clui');
const Spinner = CLI.Spinner;

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI,  { 
  useNewUrlParser: true 
  }
);
let db = mongoose.connection;
db.on('error', (err) => {
  console.log(`An error occured ==> ${err}`);
})
const Cloud = require('./models/cloudSchema');

const createCookie = (content) => {
  fs.writeFile('user.json', JSON.stringify(content), (err) => {
    if (err) throw err;
    console.log('User data saved ...');
  })
}
const deleteCookie = (filename) => {
  fs.unlink(filename, (err) => {
    if (err) throw err;
    console.log('Deleted Cookie');
  })
}
const createCloud = (cloud) => {

  const search = new RegExp(cloud.cloudIp, 'i');
  Cloud.find({$or: [{cloudIp: search}]}) // check if user exists , if yes it logins
    .exec((err, clouds) => {
      assert.equal(null, err);
      if (clouds.length) {
        console.log(`${cloud.cloudIp} this Ip is already occupied ):`);
        db.close()
      }
      else { // create new user
        bcrypt.hash(cloud.password, 10, (err, hash) => {
          if (err) {
            return next(err);
          }
          cloud.password = hash;
          cloud.insideCloud = true;
          console.log(cloud);
          Cloud.create(cloud, (err) => {
            assert.equal(null, err);
            createCookie(cloud);
            console.info('Welcome to HeavenNOTES')
            db.close()
          });
        });

      }
  })
  
};

const connectToCloud = (cloud) => {

  return new Promise((resolve, reject) => {
    Cloud.findOne({ cloudIp: cloud.cloudIp })
    .exec((err, cloudData) => {
      if (err) {
        reject(err);
        return;
      } else if (!cloud) {
        const err = new Error('Cloud is not found!');
        err.status = 401;
        return reject(err);
      }
      bcrypt.compare(cloud.password, cloudData.password, (err, result) => {
        if (result === true) {
          cloud.insideCloud = true;
          createCookie(cloud);
          console.log('loginned!!!');
          return resolve(cloudData);
        } else {
          console.info('password is not correct 0_0')
          return resolve(null);
        }
      })
    });
  });
};

const getUser = (username) => {
  const search = new RegExp(username, 'i');
  Cloud.find({$or: [{cloudIp: search}]})
    .exec((err, user) => {
      assert.equal(null, err);
      if (user.length) {
        console.log('username is already taken')
        console.info(`${user.length} matches`);
      }
      else {
        console.info('you can register')
      }
      db.close()
    })
};

class File {
  constructor(cloud, filePath) {
    this.cloudId = cloud._id;
    this.filePath = filePath;
    this.filename = filePath.replace(/^.*[\\\/]/, '');
    this.gridFSBucket = new mongoose.mongo.GridFSBucket(db.db, { bucketName: 'cloud-files' });

  }

  upload() {
      const { filename } = this;
      const writeStream = this.gridFSBucket.openUploadStream({ filename });
      fs.createReadStream(this.filePath).pipe(writeStream);
      return new Promise((resolve, reject) => {
        writeStream.on('close', (file) => {
          Cloud.findById(cloudId, (err, cloud) => {
            cloud.file = file._id;
            cloud.save((err, updatedCloud) => {
              if (err) {
                reject(err);
              }
              return resolve(JSON.stringify(updatedCloud));
            })
          })
        })
      })
      .catch(err => console.log('caught ', err));

  }
  download() {
    const { gridFSBucket, cloudId } = this;
    /*
    const readstream = (filename, stream) => 
      fs.createReadStream(__dirname + filename)
      .pipe(stream);*/
    let cloudFiles = db.collection('cloud-files.chunks');
    cloudFiles.find({ files_id: cloudId });
    console.info(cloudFiles);
    let readstream = gridFSBucket.openDownloadStream({
      _id: cloudId
    })
    return readstream.pipe();
    //return readstream('./LICENSE', uploadstream)
  }
};


module.exports = { createCloud, connectToCloud, getUser, File };





/* 

      fs.unlink(filePath, (err) => {
        // handle error
        console.log('Done ...')
      })

      use if you want pull file from pc to cloud

*/