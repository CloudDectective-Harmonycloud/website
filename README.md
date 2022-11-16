# The Kindling website

The Kindling website is powered by [Doks](https://getdoks.org).

## Development
### Prerequisites
Before building the website, please ensure you have installed the following dependencies:
- Git
- [Node.js](https://nodejs.org) — latest LTS version or newer
- [npm](https://www.npmjs.com)

### Build
1. Clone this repository.
```
git clone https://github.com/CloudDectective-Harmonycloud/website.git
```
2. Install dependencies
```
cd website && npm install
```
3. Start development server
```
npm run start
```
Doks will start the Hugo development webserver accessible by default at http://localhost:1313. Saved changes will live reload in the browser.

### Fields, Files, and Folders
[filecoin-docs](https://github.com/filecoin-project/filecoin-docs) is also a website powered by Doks. They have listed the detailed information about `What these fields, files, and folders use for`. Please check out their [docs](https://github.com/filecoin-project/filecoin-docs#files-and-folders) if you want to develop the Kindling website.

## Common Operations
### Add a Documentation Page
Add a documentation page using the `npm run create` command.
#### Example
Create a use-case documentation page under `docs/use-cases`:
```bash
npm run create docs/use-cases/a-new-use-case.md
```
And a file named `a-new-use-case.md` will be created.
```yaml
---
title: "A New Use Case"
description: ""
lead: ""
date: 2022-11-16T16:23:20+08:00
lastmod: 2022-11-16T16:23:20+08:00
draft: true
images: []
menu:
  docs:
    parent: ""
    identifier: "a-new-use-case-23f77305b93f1d8e0396e91bbd1f79f7"
weight: 999
toc: true
---

```

Modify these fields or add your text body under `---` as you wish.

### Add a Blog Post
Add a blog post using the `npm run create` command.
#### Example
Add a new blog post called `The Tutorial of Trace Profiling`.
```bash
npm run create blog/the-tutotial-of-trace-profiling/index.md
```
And a directory named `the-tutotial-of-trace-profiling` under `blog` and a file named `index.md` under `the-tutotial-of-trace-profiling` will be created.
```yaml
---
title: "The Tutotial of Trace Profiling"
description: ""
excerpt: ""
date: 2022-11-16T16:27:18+08:00
lastmod: 2022-11-16T16:27:18+08:00
draft: true
weight: 50
images: []
categories: []
tags: []
contributors: []
pinned: false
homepage: false
---

```
Modify these fields or add your text body under `---` as you wish.

If you want to add some images to the blog, please put the image files and `index.md` at the same level.