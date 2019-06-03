exports.File = (cloud, filePath) {
    this.cloudId = cloud._id;
    this.filePath = filePath;
    this.filename = filePath.replace(/^.*[\\\/]/, '');
    this.gridFSBucket = new mongoose.mongo.GridFSBucket(db.db, { bucketName: 'cloud-files' });
    
    const upload = (pull) => {
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
  
    const download = (pull) => {
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
  
  