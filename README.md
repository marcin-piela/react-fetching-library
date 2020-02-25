<p align="center">
	<a target="_blank" href="https://github.com/marcin-piela/react-fetching-library">
        <img src="/docs/_media/logo.png" />
    </a>
</p>
<p >
Simple and powerful fetching library for React. Use hooks to fetch data!

[![Watch on GitHub][github-watch-badge]][github-watch][![Star on GitHub][github-star-badge]][github-star][![Tweet][twitter-badge]][twitter]

</p>

---

[![Build Status][build-badge]][build] [![version][version-badge]][package] ![downloads][downloads-badge] [![MIT License][license-badge]][license]
 [![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc] ![Code of Conduct][gzip-badge] [![codecov](https://codecov.io/gh/marcin-piela/react-fetching-library/branch/master/graph/badge.svg)](https://codecov.io/gh/marcin-piela/react-fetching-library)

✅ Zero dependencies (react, react-dom as peer deps)

✅ SSR support 

✅ Use hooks or FACC's (Function as Child Components) - depending on your needs

✅ Uses Fetch API (but allows to use custom fetch implemenation and axios as well)

✅ Request and response interceptors allows to easily customize connection with API

✅ React Suspense support ([experimental *](#using-suspense-to-fetch-data))

✅ TypeScript support 

✅ Error boundaries to catch bad API responses

✅ Less than 3k minizipped

✅ Simple cache provider - easily to extend

✅ Handle race conditions

✅ Allows to abort pending requests


---

# react-fetching-library


Use hooks or FACC's (Function as Child Component) to fetch data in an easy way. No dependencies! Just React under the hood.

Request and response interceptors allows you to easily customize connection with API (add authorization, refresh token, cache, etc). It uses Fetch API so it can be used in SSR apps (i.e. with isomorphic-fetch).

Library allows you to use it with connection of React Suspense ([read more about React Suspense](https://blog.logrocket.com/async-rendering-in-react-with-suspense-5d0eaac886c8)) to easily maintain loading state in application.

## Documentation

Full documentation is available __[HERE](https://marcin-piela.github.io/react-fetching-library)__ 

## Short example of use

```js
import { useQuery } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => {
  const { loading, payload, error, query } = useQuery(fetchUsersList);

  return <UsersList loading={loading} error={error} users={payload} onReload={query} />;
};
```

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-query-hook?module=/src/usersList/UsersListContainer.tsx)

## Typescript support

<img src="/docs/_media/typescript.gif" />

## Inspirations

- [react-fetching-data by Robin Wieruch](https://www.robinwieruch.de/react-fetching-data/)
- [fetch-suspense](https://github.com/CharlesStover/fetch-suspense)
- [redux-api-middleware](https://github.com/agraboso/redux-api-middleware)

## Contributing

Feel free to open PRs and issues to make this library better !

When making a PR, make sure all tests pass. If you add a new feature, please consider updating the documentation or codesandbox examples. Thank you!

## Using Suspense to fetch data

For now React Suspense is not production ready to use it for fetch data as described [here](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#react-16x-mid-2019-the-one-with-suspense-for-data-fetching), so API of our component/hook may change in the future. 


## License

react-fetching-library is licensed under the [MIT license](http://opensource.org/licenses/MIT).

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/marcin-piela/react-fetching-library.svg?style=flat-square
[build]: https://travis-ci.org/marcin-piela/react-fetching-library
[version-badge]: https://img.shields.io/npm/v/react-fetching-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-fetching-library
[downloads-badge]: https://img.shields.io/npm/dm/react-fetching-library.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/react-fetching-library.svg?style=flat-square
[license]: https://github.com/marcin-piela/react-fetching-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/marcin-piela/react-fetching-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/marcin-piela/react-fetching-library.svg?style=social
[github-watch]: https://github.com/marcin-piela/react-fetching-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/marcin-piela/react-fetching-library.svg?style=social
[github-star]: https://github.com/marcin-piela/react-fetching-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20react-fetching-library%20https%3A%2F%2Fgithub.com%2Fmarcin-piela%2Freact-fetching-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/marcin-piela/react-fetching-library.svg?style=social
[gzip-badge]:https://badgen.net/bundlephobia/minzip/react-fetching-library@1.6.1
