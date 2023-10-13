# create-new-site

Markdown-based static site generator that aims to simplify the process of creating static websites by
utilizing the power of Markdown, EJS Templates, new.css, and modularity.

`create-new-site` provides an efficient and developer-friendly solution for those who prefer to
work with Markdown for static and are in need of a performant static site.

# FAQ

### How do I get started?

To begin, execute `create-new-site`. This will generate both a `dev` and `production`
folder (do keep in mind the `prod` folder is intended for initial previews).
Navigate to the development folder and make your changes.
After completing your modifications, rerun the `create-new-site` command.

### Can I change the location of the /dev/ and /prod/ folder?

Yes! Simply use --src (dev) and/or --dst (prod) to make your changes.

### Is there a GitHub Workflow I can use for create-new-site?

Yes! You can find it
[here](https://github.com/juanpisss/create-new-site/blob/main/.github/workflows/gh-pages-deploy.yml).

### May I see a preview?

[Sure!](https://shmugo.co)

# License & Credits

**License:** This project is licensed under the
[MIT License](https://github.com/juanpisss/create-new-site/blob/main/LICENSE).

**Credits:** The credits for this project can be found in the same
[MIT License](https://github.com/juanpisss/create-new-site/blob/main/LICENSE).

# Contribution & Support

If you have ideas for improvements, bug fixes, new features, or found a bug, please feel free
to create issues or pull requests in this repository.

# TODO:

## Development Related

-   [ ] Upload to NPM
-   [ ] Improve Error Managment
-   [ ] Move to TypeScript

## User Experience / Features

-   [ ] Beautify console logs
-   [ ] Sort NavBar by user choice
    -   through config.yaml? through automtic sorting (home first 'n the rest whatever the computer decides)
-   [ ] Implement Blog Support
-   [ ] Subdirectory/Page Support
