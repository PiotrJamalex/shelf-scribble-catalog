
module.exports = {
  appId: 'com.systemInwentaryzacji.app',
  productName: 'System Inwentaryzacji',
  directories: {
    output: 'release'
  },
  files: [
    'dist/**/*',
    'electron/**/*',
    'node_modules/**/*'
  ],
  win: {
    target: 'nsis',
    icon: 'public/favicon.ico'
  },
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true
  }
};
