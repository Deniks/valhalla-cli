require('dotenv').config();
const mongoose = require('mongoose');

const assert = require('assert');
const bcrypt = require('bcrypt');
const fs = require('fs');
const CLI = require('clui');
const Progress = CLI.Progress;
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
          //createCookie(cloud);
          console.log('loginned!!!');
          return resolve(cloudData);
        } else {
          console.info('password is not correct 0_0')
          return resolve(null);
        }
      })
    });
  })
  .then((data) =>  {
    const files = data.files.map(file => {

      let readstream = gridFSBucket.openDownloadStreamById(file);
      console.log(readstream)
        eadstream
          .pipe(fs.createWriteStream(filePath))
          .on('error', (error) => {
            console.info(": : : error");
            assert.ifError(error);
          })
          .on('finish', () => {
            let thisProgressBar = new Progress(20);
            console.log(thisProgressBar.update(10, 30));
            if (pull) {
              gridFSBucket.delete(readstream.id, (err) => {
                assert.equal(err, null);
              })
              Cloud.update({_id: cloudId}, { $pullAll: { files: [readstream._id] } })
            }
            console.info('done!');
            process.exit();
          })


      console.log(file)
      console.log(db.collection('cloud-files.files'))
      const filesQuery = db.collection('cloud-files.files').find({ _id: file });
      console.log(filesQuery)
    });
    
  })
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

  upload(pull) {
      const { filename, filePath, cloudId } = this;


      const writeStream = this.gridFSBucket.openUploadStream({ filename }).once('finish', () => {
        let down
      });
      
      fs.createReadStream(filePath).pipe(writeStream);
      writeStream.on('finish', (file) => {
        Cloud.findOneAndUpdate(cloudId, {
          "$push": {
            files: file._id
          },
        }, (err, updatedCloud) => {
          if (err) assert(err);
          if (pull) fs.unlinkSync(filePath);
          console.info('File uploaded!');
          console.log(updatedCloud);
          process.exit();
        });
      });
  }

  download(pull) {
    const { gridFSBucket, cloudId, filename, filePath } = this;
    console.info('active')
    let readstream = gridFSBucket.openDownloadStreamByName({filename});
  console.log(readstream)
    return readstream
      .pipe(fs.createWriteStream(filePath))
      .on('error', (error) => {
        console.info(": : : error");
        assert.ifError(error);
      })
      .on('finish', () => {
        let thisProgressBar = new Progress(20);
        console.log(thisProgressBar.update(10, 30));
        if (pull) {
          gridFSBucket.delete(readstream.id, (err) => {
            assert.equal(err, null);
          })
          Cloud.update({_id: cloudId}, { $pullAll: { files: [readstream._id] } })
        }
        console.info('done!');
        process.exit();
      })
    //return readstream('./LICENSE', uploadstream)
  }
};


module.exports = { createCloud, connectToCloud, getUser, File };
