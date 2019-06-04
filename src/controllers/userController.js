const Cloud = require('../models/cloudSchema');

exports.getUser = (username) => {
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
  