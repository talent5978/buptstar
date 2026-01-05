module.exports = {
  apps: [
    {
      name: 'buptstar-backend',
      script: './backend/index.js',
      cwd: '/var/www/buptstar-web',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './backend/logs/pm2-error.log',
      out_file: './backend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'buptstar-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/var/www/buptstar-web',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './frontend/logs/pm2-error.log',
      out_file: './frontend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
