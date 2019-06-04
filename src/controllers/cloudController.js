const Cloud = require('../models/cloudSchema');

const bcrypt = require('bcrypt')

exports.createCloud = (cloud) => {

    const search = new RegExp(cloud.cloudIp, 'i');
    Cloud.find({$or: [{cloudIp: search}]}) // check if user exists , if yes it logins
      .exec((err, clouds) => {
        assert.equal(null, err);
        if (clouds.length) {
          console.log(`${cloud.cloudIp} this Ip is already occupied ):`);
          db.close();
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

exports.connectToCloud = (cloud) => {

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