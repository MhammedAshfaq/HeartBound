const config = {
  title: 'Healthy-Relationship Docs',
  tagline: 'Project Documentation',
  url: 'http://localhost:3005',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: undefined,
        },
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Healthy-Relationship',
      items: [
        { type: 'doc', docId: 'welcome', position: 'left', label: 'Docs' },
      ],
    },
  },
};

module.exports = config;
