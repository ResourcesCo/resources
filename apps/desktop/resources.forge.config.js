module.exports = {
  packagerConfig: {
    osxSign: {
      'hardened-runtime': true,
      hardenedRuntime: true,
      'gatekeeper-assess': false,
      entitlements: './resources/entitlements.mac.plist',
      'entitlements-inherit': './resources/entitlements.mac.plist',
    },
    osxNotarize: {
      appBundleId: 'co.resources.ResourcesCo',
      appPath: './out/Resources-darwin-x64/Resources.co.app',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
    },
    name: 'Resources.co',
    appBundleId: 'co.resources.ResourcesCo',
    appCategoryType: 'public.app-category.developer-tools',
    icon: 'resources/icon',
    ignore: 'packages/desktop-bundle',
  },
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
}
