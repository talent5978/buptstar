const bcrypt = require('bcryptjs');
const { createHash } = require('crypto');
const database = require('../database');

const DEFAULT_USERS = [
  {
    username: 'admin',
    displayName: '管理员',
    role: 'admin',
    password: 'bupt2026star'
  }
];

const ensureDefaultUsers = () => {
  DEFAULT_USERS.forEach((user) => {
    const passwordDigest = createHash('sha256').update(user.password).digest('hex');
    const existing = database.getAnyUserByUsernameAndRole(user.username, user.role);
    if (existing) {
      // Keep the built-in admin account pinned to the configured password.
      if (user.username === 'admin' && user.role === 'admin') {
        database.updateUserPassword(existing.id, bcrypt.hashSync(passwordDigest, 10));
        return;
      }

      const alreadyNewScheme = bcrypt.compareSync(passwordDigest, existing.password_hash);
      if (alreadyNewScheme) return;

      const legacyScheme = bcrypt.compareSync(user.password, existing.password_hash);
      if (legacyScheme) {
        database.updateUserPassword(existing.id, bcrypt.hashSync(passwordDigest, 10));
      }
      return;
    }

    database.upsertUser({
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      passwordHash: bcrypt.hashSync(passwordDigest, 10)
    });
  });
};

module.exports = {
  ensureDefaultUsers
};
