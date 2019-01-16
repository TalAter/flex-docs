---
title: Getting started with FTW
slug: getting-started-with-ftw
date: 2019-01-10
category: tutorials
ingress:
  This tutorial is the place to start your journey of getting hands-on with
  Sharetribe Flex. You will learn the basic building blocks by creating an
  example marketplace with the Flex Template for Web (FTW).
skills: basic command line, text editing
---

FTW is a marketplace web application built on top of the
[Marketplace API](/background/concepts/#marketplace-api). While you can create a
marketplace purely using just the API, it requires a lot of effort and we
recommened using the template as a starting point for customizations.

Depending on your needs for customization, changing the template application
requires varying levels of development knowledge. For this tutorial it is enough
to know how to open a terminal to run some commands and edit text files to
change configuration values.

For more information on what skills are needed for customization, see the
[What development skills are needed?](/background/development-skills/) article.

## Request API access

To use the Marketplace API, you will need an API key. You can request access at
https://sharetribe.typeform.com/to/BI9M4O

## Install development tooling

To get FTW up and running, you will need to download and install some basic
development tooling:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/docs/install)

## Setup FTW

Clone the Git repository:

```sh
git clone https://github.com/sharetribe/flex-template-web.git
```

**NOTE:** When starting an actual customization project, we recommend forking
the Git repository instead of cloning it. This enables pulling in FTW updates
later. However, for the purposes of this tutorial, cloning the repository is
enough.

Go to the cloned directory:

```sh
cd flex-template-web/
```

Create an environment configuration file from the template:

```sh
cp .env-template .env
```

When you open the `.env` file in a text editor, you can see that there are three
required variables:

- **`REACT_APP_SHARETRIBE_SDK_CLIENT_ID`**

  Client ID is the API key you will use to access the Flex API with the SDK.

  The application won't start without a Client ID.

- **`REACT_APP_STRIPE_PUBLISHABLE_KEY`**

  Public Stripe key enables payments using Stripe. You can follow
  [Stripe account set up guide for Sharetribe Go](https://help.sharetribe.com/sharetribe-go-payments-and-transactions/online-payments-with-stripe/how-to-configure-your-stripe-account-and-get-api-keys-for-your-marketplace)
  to get the publishable key. As Sharetribe Go is a completely different
  product, skip the parts with the admin panel and paste the key in the `.env`
  configuration file.

  If you don't set the Stripe key, payment's won't work in the application.

- **`REACT_APP_MAPBOX_ACCESS_TOKEN`**

  Mapbox access token is used for the maps in the marketplace. Follow the
  [Mapbox set up guide](/guides/how-to-set-up-mapbox-for-ftw/) to get your
  access token.

  If you don't set the Mapbox key, the map components won't work in the
  application.

## Start the server

Install all dependencies:

```sh
yarn install
```

Start the development server:

```sh
yarn run dev
```

This will automatically open http://localhost:3000 in a browser:

![Default marketplace screenshot](./saunatime-default.png)

## Make a customization

Now that we have the default template marketplace running, let's make some
customizations!

Open the `src/marketplace.css` file with a text editor and change the variable
`--marketplaceColor` to have a different value:

```css
--marketplaceColor: rebeccapurple;
```

This will automatically refresh the browser and show the updated styles:

![Customized marketplace screenshot](./saunatime-customized.png)

## Summary

In this tutorial, we used Flex Template for Web to make our own customized
marketplace. As you see, FTW is a fully ready and polished marketplace
application that is running on top of the Marketplace API. All of the
customization is in your control, and you can change it to fit your marketplace
needs. See our [Guides](/guides/) for instructions on how to do specific
customizations.