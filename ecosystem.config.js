module.exports = {
  apps : [{
    name: "Coconut-API",
    script: "--max-old-space-size=8192 server.js ./server.js",
    autorestart: true,
    watch: false,
    max_memory_restart: "8G",
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }],

  // deploy : {
  //   production : {
  //     key  : "~/.ssh/oneportal-api-production.pem",
  //     user : "ec2-user",
  //     host : "oneportal-api.thidiff.com",
  //     ref  : 'origin/development',
  //     repo : 'git@bitbucket.org:thidiff/oneportal-api.git',
  //     path : '/home/ec2-user/app/',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm run prod',
  //     'pre-setup': ''
  //   }
  // }
};
