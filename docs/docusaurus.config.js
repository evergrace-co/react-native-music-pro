// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Native Track Player',
  tagline: 'A fully fledged audio module created for music apps',
  url: 'https://evergrace-co.github.io/react-native-audio-pro',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  organizationName: 'evergrace-co',
  projectName: 'react-native-audio-pro',
  deploymentBranch: 'main',
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/evergrace-co/react-native-audio-pro/tree/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'React Native Track Player',
        logo: {
          alt: 'React Native Track Player Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'left',
            dropdownItemsAfter: [],
            dropdownActiveClassDisabled: true,
          },
          {
            type: 'doc',
            docId: 'intro',
            position: 'right',
            label: 'Intro',
          },
          {
            type: 'doc',
            docId: 'basics/installation',
            position: 'right',
            label: 'Docs',
          },
          {
            href: 'https://github.com/evergrace-co/react-native-audio-pro',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Intro',
                to: '/docs/intro',
              },
              {
                label: 'Getting Started',
                to: '/docs/basics/installation',
              },
              {
                label: 'API Reference',
                to: '/docs/api/events',
              }
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/evergrace-co/react-native-audio-pro',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/ya2XDCR',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/react-native-audio-pro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Become A Sponsor',
                href: 'https://github.com/sponsors/evergrace-co',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Double Symmetry GmbH. All Rights Reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'CYSR91W7SU',
        apiKey: 'a5ab4af3642fdd7fbc07030593017797',
        indexName: 'react-native-audio-pro',
        contextualSearch: true,
      },
    }),
};

module.exports = config;
