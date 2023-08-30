const bcrypt = require('bcrypt');

const passwordChange = async (user,oldPass,newPass) => {
    let change;
    if(newPass) {
        change = newPass ? await bcrypt.compare(oldPass,user.password) : null;
    }
};

module.exports = {
    passwordChange
}