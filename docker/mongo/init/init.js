var newUsers = [
  {
    user: 'example',
    pwd: 'example',
    roles: [
      {
        role: 'readWrite',
        db: 'example'
      }
    ]
  }
];

var currentUsers = db.getUsers();
if (currentUsers.length === newUsers.length) {
  quit();
}
db.dropAllUsers();

for (var i = 0, length = newUsers.length; i < length; ++i) {
  db.createUser(newUsers[i]);
}
